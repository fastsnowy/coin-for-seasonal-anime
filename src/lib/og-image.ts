import { lookup as dnsLookup } from "node:dns";
import { lookup } from "node:dns/promises";
import { BlockList, isIP } from "node:net";
import { Agent, fetch as undiciFetch } from "undici";
import { toSafeHttpUrl } from "./safe-url";

const FETCH_TIMEOUT_MS = 4_000;
const MAX_HTML_BYTES = 256 * 1024;
const MAX_REDIRECTS = 3;
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
  ["100::", 64], ["2001::", 32], ["2001:db8::", 32], ["64:ff9b:1::", 48], ["fc00::", 7], ["fe80::", 10], ["fec0::", 10], ["ff00::", 8],
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

type ResolvedAddress = { address: string; family: number };
type Resolver = (hostname: string) => Promise<ResolvedAddress[]>;

const resolveAll: Resolver = (hostname) =>
  new Promise((resolve, reject) =>
    dnsLookup(hostname, { all: true }, (err, addresses) => (err ? reject(err) : resolve(addresses))),
  );

/**
 * 接続時に使う名前解決。ここで公開アドレスと確認できたものだけを socket に渡すので、
 * 検証と接続で別々に名前解決する DNS rebinding (TOCTOU) が起きない。
 * 1つでも private アドレスが含まれていれば拒否する (公開IPだけに絞ると、攻撃者の用意した
 * 混在レコードを許容することになり、意図しない到達先が混ざる余地を残すため)。
 */
export function createSafeLookup(resolver: Resolver = resolveAll) {
  return (
    hostname: string,
    options: { all?: boolean },
    callback: (err: Error | null, address?: string | ResolvedAddress[], family?: number) => void,
  ): void => {
    resolver(hostname.replace(/^\[|\]$/g, "")).then(
      (addresses) => {
        if (addresses.length === 0 || addresses.some((a) => isPrivateAddress(a.address))) {
          callback(new Error(`blocked address for ${hostname}`));
        } else if (options?.all) {
          callback(null, addresses);
        } else {
          callback(null, addresses[0].address, addresses[0].family);
        }
      },
      (err: Error) => callback(err),
    );
  };
}

export function createSafeAgent(resolver?: Resolver): Agent {
  return new Agent({ connect: { lookup: createSafeLookup(resolver) as never } });
}

const safeAgent = createSafeAgent();

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
  init: { signal?: AbortSignal; dispatcher?: Agent } = {},
): Promise<{ res: Response; url: URL } | undefined> {
  let current = startUrl;
  let userAgent = USER_AGENT;
  for (let i = 0; i <= MAX_REDIRECTS; i++) {
    if (!(await isPublicHttpUrl(current))) return undefined;
    const res = (await undiciFetch(current.toString(), {
      dispatcher: init.dispatcher ?? safeAgent,
      redirect: "manual",
      headers: { "user-agent": userAgent, accept, "accept-language": "ja,en;q=0.8" },
      signal: AbortSignal.any([AbortSignal.timeout(FETCH_TIMEOUT_MS), ...(init.signal ? [init.signal] : [])]),
    })) as unknown as Response;
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

/** 一時的な失敗 (タイムアウト・接続/DNSエラー・5xx・429・403 等)。結果をキャッシュしてはいけない */
export class OgFetchTransientError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "OgFetchTransientError";
  }
}

/** HTML 取得の HTTP ステータスを分類する。ok: 解析する / none: OGP なしで確定 / transient: 再試行余地あり */
export function classifyOgStatus(status: number): "ok" | "none" | "transient" {
  if (status >= 200 && status < 300) return "ok";
  if (status === 403 || status === 408 || status === 429 || status >= 500) return "transient";
  return "none";
}

const NEGATIVE_CACHE_TTL_MS = 5 * 60 * 1000;
const NEGATIVE_CACHE_MAX = 500;
const failedSites = new Map<string, number>();

/** 失敗したサイトを短時間だけ記憶し、落ちているサイトが SSR ごとに最大4秒を消費しないようにする */
export function rememberOgFailure(siteUrl: string, now = Date.now()): void {
  failedSites.delete(siteUrl);
  failedSites.set(siteUrl, now + NEGATIVE_CACHE_TTL_MS);
  while (failedSites.size > NEGATIVE_CACHE_MAX) {
    const oldest = failedSites.keys().next().value;
    if (oldest === undefined) break;
    failedSites.delete(oldest);
  }
}

export function isOgFailureCached(siteUrl: string, now = Date.now()): boolean {
  const expiresAt = failedSites.get(siteUrl);
  if (expiresAt === undefined) return false;
  if (expiresAt <= now) {
    failedSites.delete(siteUrl);
    return false;
  }
  return true;
}

export function clearOgFailures(): void {
  failedSites.clear();
}

/**
 * 公式サイトの OGP 画像URLをサーバー側で取得する。
 * 確定結果は値で返す: OGP あり / OGP なし (2xx で og:image 無し、404 等) / 非公開ホスト -> undefined。
 * 一時的な失敗は OgFetchTransientError を投げる (呼び出し側のキャッシュに保存させないため)。
 */
export async function fetchOgImageUrl(siteUrl: string, signal?: AbortSignal): Promise<string | undefined> {
  if (isOgFailureCached(siteUrl)) throw new OgFetchTransientError("recently failed");
  try {
    const fetched = await fetchPublic(new URL(siteUrl), "text/html,application/xhtml+xml", { signal });
    if (!fetched) return undefined;
    const kind = classifyOgStatus(fetched.res.status);
    if (kind === "transient") {
      await fetched.res.body?.cancel().catch(() => undefined);
      throw new OgFetchTransientError(`status ${fetched.res.status}`);
    }
    if (kind === "none") {
      await fetched.res.body?.cancel().catch(() => undefined);
      return undefined;
    }
    const html = decodeHtml(await readLimited(fetched.res), fetched.res.headers.get("content-type"));
    return extractOgImageUrl(html, fetched.url.toString());
  } catch (err) {
    rememberOgFailure(siteUrl);
    throw err instanceof OgFetchTransientError ? err : new OgFetchTransientError("fetch failed", { cause: err });
  }
}
