import { lookup } from "node:dns/promises";
import { BlockList, isIP } from "node:net";
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
  return extractFallbackImageUrl(html, pageUrl);
}

const KEY_VISUAL_NAME = /(?:^|[^a-z])(?:kv|mv|keyvisual|key[_-]visual|mainvisual|main[_-]visual|visual)\d*(?:[^a-z]|$)/i;
const NON_VISUAL_NAME = /icon|logo|sprite|btn|button|arrow|favicon|banner/i;

function resolveImage(raw: string | undefined, pageUrl: string): string | undefined {
  if (!raw || /^data:/i.test(raw.trim())) return undefined;
  try {
    const url = new URL(decodeEntities(raw.trim()), pageUrl);
    if (/\.svg$/i.test(url.pathname)) return undefined;
    return toSafeHttpUrl(url.toString());
  } catch {
    return undefined;
  }
}

/**
 * OGP が無いサイト向けの最終手段。`<link rel="image_src">`、次に
 * キービジュアルらしいファイル名 (kv, keyvisual, mainvisual, mv, visual) の最初の <img> を使う。
 */
function extractFallbackImageUrl(html: string, pageUrl: string): string | undefined {
  for (const m of html.matchAll(/<link\b[^>]*>/gi)) {
    const attrs = parseAttributes(m[0].replace(/^<link/i, "<meta"));
    if (attrs.get("rel")?.toLowerCase().split(/\s+/).includes("image_src")) {
      const resolved = resolveImage(attrs.get("href"), pageUrl);
      if (resolved) return resolved;
    }
  }
  for (const m of html.matchAll(/<img\b[^>]*>/gi)) {
    const attrs = parseAttributes(m[0].replace(/^<img/i, "<meta"));
    for (const raw of [attrs.get("src"), attrs.get("data-src")]) {
      const resolved = resolveImage(raw, pageUrl);
      if (!resolved) continue;
      const name = decodeURIComponent(new URL(resolved).pathname.split("/").pop() ?? "").replace(/\.[a-z0-9]+$/i, "");
      if (KEY_VISUAL_NAME.test(name) && !NON_VISUAL_NAME.test(name)) return resolved;
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

const blockedAddresses = new BlockList();
for (const [net, prefix] of [
  ["0.0.0.0", 8], ["10.0.0.0", 8], ["100.64.0.0", 10], ["127.0.0.0", 8], ["169.254.0.0", 16],
  ["172.16.0.0", 12], ["192.0.0.0", 24], ["192.0.2.0", 24], ["192.168.0.0", 16], ["198.18.0.0", 15],
  ["198.51.100.0", 24], ["203.0.113.0", 24], ["224.0.0.0", 4], ["240.0.0.0", 4],
] as const) {
  blockedAddresses.addSubnet(net, prefix, "ipv4");
}
blockedAddresses.addAddress("255.255.255.255", "ipv4");
for (const [net, prefix] of [
  ["100::", 64], ["2001:db8::", 32], ["fc00::", 7], ["fe80::", 10], ["ff00::", 8],
] as const) {
  blockedAddresses.addSubnet(net, prefix, "ipv6");
}
blockedAddresses.addAddress("::", "ipv6");
blockedAddresses.addAddress("::1", "ipv6");

/** IPv6 アドレスを 8 個の 16bit 値に展開する (不正なら undefined) */
function ipv6Groups(address: string): number[] | undefined {
  let addr = address.toLowerCase().split("%")[0];
  const dotted = /(\d+\.\d+\.\d+\.\d+)$/.exec(addr);
  if (dotted) {
    const o = dotted[1].split(".").map(Number);
    addr = addr.slice(0, -dotted[1].length) + ((o[0] << 8) | o[1]).toString(16) + ":" + ((o[2] << 8) | o[3]).toString(16);
  }
  const halves = addr.split("::");
  if (halves.length > 2) return undefined;
  const head = halves[0] ? halves[0].split(":") : [];
  const tail = halves.length === 2 && halves[1] ? halves[1].split(":") : [];
  const fill = halves.length === 2 ? 8 - head.length - tail.length : 0;
  if (fill < 0) return undefined;
  const groups = [...head, ...Array<string>(fill).fill("0"), ...tail].map((g) => Number.parseInt(g, 16));
  return groups.length === 8 && groups.every((g) => g >= 0 && g <= 0xffff) ? groups : undefined;
}

/** IPv4 を埋め込む IPv6 形式 (mapped / compatible / NAT64 / 6to4) から IPv4 を取り出す */
function embeddedIpv4(g: number[]): string | undefined {
  const v4 = (hi: number, lo: number) => `${hi >> 8}.${hi & 255}.${lo >> 8}.${lo & 255}`;
  if (g.slice(0, 5).every((x) => x === 0) && (g[5] === 0xffff || g[5] === 0)) return v4(g[6], g[7]);
  if (g[0] === 0x64 && g[1] === 0xff9b && g.slice(2, 6).every((x) => x === 0)) return v4(g[6], g[7]);
  if (g[0] === 0x2002) return v4(g[1], g[2]);
  return undefined;
}

export function isPrivateAddress(address: string): boolean {
  const family = isIP(address);
  if (family === 4) return blockedAddresses.check(address, "ipv4");
  if (family !== 6) return true;
  const groups = ipv6Groups(address);
  if (!groups) return true;
  const embedded = embeddedIpv4(groups);
  if (embedded && blockedAddresses.check(embedded, "ipv4")) return true;
  return blockedAddresses.check(address.split("%")[0], "ipv6");
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
  init: { revalidate?: number; signal?: AbortSignal } = {},
): Promise<{ res: Response; url: URL } | undefined> {
  let current = startUrl;
  let userAgent = USER_AGENT;
  for (let i = 0; i <= MAX_REDIRECTS; i++) {
    if (!(await isPublicHttpUrl(current))) return undefined;
    const res = await fetch(current, {
      redirect: "manual",
      headers: { "user-agent": userAgent, accept, "accept-language": "ja,en;q=0.8" },
      signal: AbortSignal.any([AbortSignal.timeout(FETCH_TIMEOUT_MS), ...(init.signal ? [init.signal] : [])]),
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
export async function fetchOgImageUrl(siteUrl: string, signal?: AbortSignal): Promise<string | undefined> {
  try {
    const fetched = await fetchPublic(new URL(siteUrl), "text/html,application/xhtml+xml", {
      revalidate: REVALIDATE_SECONDS,
      signal,
    });
    if (!fetched || !fetched.res.ok) return undefined;
    const html = decodeHtml(await readLimited(fetched.res), fetched.res.headers.get("content-type"));
    return extractOgImageUrl(html, fetched.url.toString());
  } catch {
    // タイムアウトや接続エラー時はプレースホルダ表示のままにする
  }
  return undefined;
}
