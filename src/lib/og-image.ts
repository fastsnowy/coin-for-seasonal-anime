import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import { toSafeHttpUrl } from "./safe-url";

const FETCH_TIMEOUT_MS = 4_000;
const MAX_HTML_BYTES = 256 * 1024;
const MAX_REDIRECTS = 3;
const REVALIDATE_SECONDS = 60 * 60 * 24;
const USER_AGENT = "Mozilla/5.0 (compatible; AnicoyBot/1.0; +https://github.com/fastsnowy/coin-for-seasonal-anime)";
// bot UA を 403 で弾く公式サイト向けのフォールバック
const BROWSER_USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

const IMAGE_META_KEYS = [
  "og:image:secure_url",
  "og:image:url",
  "og:image",
  "twitter:image",
  "twitter:image:src",
];

function decodeEntities(value: string): string {
  return value
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#0*39;|&apos;/gi, "'")
    .replace(/&#x0*26;/gi, "&");
}

function parseAttributes(tag: string): Map<string, string> {
  const attrs = new Map<string, string>();
  const re = /([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;
  for (const m of tag.replace(/^<meta/i, "").matchAll(re)) {
    attrs.set(m[1].toLowerCase(), m[2] ?? m[3] ?? m[4] ?? "");
  }
  return attrs;
}

/**
 * HTML から OGP 画像URLを取り出し、ページURL基準で絶対URLに解決する。
 * `property` / `name` どちらの指定、属性順、引用符の違い、相対URL、
 * `twitter:image` へのフォールバックに対応する。
 */
export function extractOgImageUrl(html: string, pageUrl: string): string | undefined {
  const found = new Map<string, string>();
  for (const m of html.matchAll(/<meta\b[^>]*>/gi)) {
    const attrs = parseAttributes(m[0]);
    const key = (attrs.get("property") ?? attrs.get("name") ?? "").trim().toLowerCase();
    const content = attrs.get("content")?.trim();
    if (content && IMAGE_META_KEYS.includes(key) && !found.has(key)) {
      found.set(key, content);
    }
  }
  for (const key of IMAGE_META_KEYS) {
    const raw = found.get(key);
    if (!raw) continue;
    try {
      const resolved = toSafeHttpUrl(new URL(decodeEntities(raw), pageUrl).toString());
      if (resolved) return resolved;
    } catch {
      // 次の候補へ
    }
  }
  return undefined;
}

/** 文字コード判定: Content-Type -> meta charset の順。未知のラベルは UTF-8 で読む */
function decodeHtml(bytes: Uint8Array, contentType: string | null): string {
  const head = new TextDecoder("latin1").decode(bytes.subarray(0, 2048));
  const label =
    /charset=["']?([\w-]+)/i.exec(contentType ?? "")?.[1] ??
    /<meta[^>]+charset=["']?([\w-]+)/i.exec(head)?.[1] ??
    "utf-8";
  try {
    return new TextDecoder(label).decode(bytes);
  } catch {
    return new TextDecoder("utf-8").decode(bytes);
  }
}

export function isPrivateAddress(address: string): boolean {
  if (isIP(address) === 4) {
    const [a, b] = address.split(".").map(Number);
    return (
      a === 0 || a === 10 || a === 127 || (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) ||
      (a === 100 && b >= 64 && b <= 127) || a >= 224
    );
  }
  const v6 = address.toLowerCase();
  const mapped = /^::ffff:(\d+\.\d+\.\d+\.\d+)$/.exec(v6);
  if (mapped) return isPrivateAddress(mapped[1]);
  return v6 === "::" || v6 === "::1" || /^f[cd]/.test(v6) || /^fe[89ab]/.test(v6);
}

/** サーバー側から取得してよい公開ホストかを確認する (SSRF対策) */
export async function isPublicHttpUrl(url: URL): Promise<boolean> {
  if (url.protocol !== "http:" && url.protocol !== "https:") return false;
  if (url.port && url.port !== "80" && url.port !== "443") return false;
  const host = url.hostname.replace(/^\[|\]$/g, "");
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local")) return false;
  if (isIP(host)) return !isPrivateAddress(host);
  try {
    const addresses = await lookup(host, { all: true });
    return addresses.length > 0 && addresses.every((a) => !isPrivateAddress(a.address));
  } catch {
    return false;
  }
}

async function readLimited(res: Response): Promise<Uint8Array> {
  const bytes = await readBodyWithLimit(res, MAX_HTML_BYTES, false);
  return bytes ?? new Uint8Array();
}

/**
 * レスポンス本文を最大 maxBytes まで読む。
 * strict=true で上限超過なら undefined (取得中止)、false なら先頭 maxBytes で切り詰める。
 */
export async function readBodyWithLimit(
  res: Response,
  maxBytes: number,
  strict: boolean,
): Promise<Uint8Array | undefined> {
  if (!res.body) return new Uint8Array();
  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (total < maxBytes || strict) {
    const { done, value } = await reader.read();
    if (done || !value) break;
    chunks.push(value);
    total += value.length;
    if (strict && total > maxBytes) {
      await reader.cancel().catch(() => undefined);
      return undefined;
    }
    if (!strict && total >= maxBytes) break;
  }
  await reader.cancel().catch(() => undefined);
  const out = new Uint8Array(Math.min(total, maxBytes));
  let offset = 0;
  for (const chunk of chunks) {
    const slice = chunk.subarray(0, out.length - offset);
    out.set(slice, offset);
    offset += slice.length;
  }
  return out;
}

/**
 * 公開ホストにのみ GET する。リダイレクトは1ホップごとにSSRF検証し、最大 MAX_REDIRECTS 回まで。
 * bot UA が 403 の場合はブラウザ風 UA で1回だけ再試行する。
 */
export async function fetchPublic(
  startUrl: URL,
  accept: string,
  init: { revalidate?: number } = {},
): Promise<{ res: Response; url: URL } | undefined> {
  let current = startUrl;
  let userAgent = USER_AGENT;
  for (let i = 0; i <= MAX_REDIRECTS; i++) {
    if (!(await isPublicHttpUrl(current))) return undefined;
    const res = await fetch(current, {
      redirect: "manual",
      headers: { "user-agent": userAgent, accept, "accept-language": "ja,en;q=0.8" },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      ...(init.revalidate ? { next: { revalidate: init.revalidate } } : {}),
    });
    const location = res.headers.get("location");
    if (res.status >= 300 && res.status < 400 && location) {
      await res.body?.cancel().catch(() => undefined);
      current = new URL(location, current);
      continue;
    }
    if (res.status === 403 && userAgent === USER_AGENT) {
      await res.body?.cancel().catch(() => undefined);
      userAgent = BROWSER_USER_AGENT;
      i--;
      continue;
    }
    return { res, url: current };
  }
  return undefined;
}

/** 公式サイトの OGP 画像URLをサーバー側で取得する。失敗時は undefined。 */
export async function fetchOgImageUrl(siteUrl: string): Promise<string | undefined> {
  try {
    const fetched = await fetchPublic(new URL(siteUrl), "text/html,application/xhtml+xml", {
      revalidate: REVALIDATE_SECONDS,
    });
    if (!fetched || !fetched.res.ok) return undefined;
    const html = decodeHtml(await readLimited(fetched.res), fetched.res.headers.get("content-type"));
    return extractOgImageUrl(html, fetched.url.toString());
  } catch {
    // タイムアウトや接続エラー時はプレースホルダ表示のままにする
  }
  return undefined;
}
