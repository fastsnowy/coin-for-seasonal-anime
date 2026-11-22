import { createHmac, timingSafeEqual } from "node:crypto";

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

// SVG はスクリプトを含められるため許可しない
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

/** 公式サイトURLへの HMAC-SHA256 署名 (base64url)。署名付きURLのみプロキシが応答する (オープンプロキシ化の防止) */
export function signSite(siteUrl: string, secret: string): string {
  return createHmac("sha256", secret).update(siteUrl).digest("base64url");
}

export function verifySiteSignature(siteUrl: string, sig: string | null, secret: string): boolean {
  if (!sig) return false;
  const expected = Buffer.from(signSite(siteUrl, secret));
  const actual = Buffer.from(sig);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

/** プロキシ経由の同一オリジン画像URL (外部サイトの CORP: same-origin を回避するため) */
export function ogImageProxyPath(siteUrl: string, secret: string): string {
  return `/api/og-image?site=${encodeURIComponent(siteUrl)}&sig=${signSite(siteUrl, secret)}`;
}

/** 配信してよい画像の Content-Type か。パラメータは無視し、正規化した type を返す */
export function toAllowedImageType(contentType: string | null): string | undefined {
  const type = contentType?.split(";")[0].trim().toLowerCase();
  return type && ALLOWED_IMAGE_TYPES.has(type) ? type : undefined;
}

/** Content-Length 宣言が上限を超えているか */
export function exceedsImageLimit(contentLength: string | null): boolean {
  if (contentLength === null) return false;
  const n = Number(contentLength);
  return Number.isFinite(n) && n > MAX_IMAGE_BYTES;
}
