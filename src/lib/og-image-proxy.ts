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

/** 画像URLへの HMAC-SHA256 署名 (base64url)。署名付きURLのみプロキシが応答する (オープンプロキシ化の防止) */
export function signImageUrl(imageUrl: string, secret: string): string {
  return createHmac("sha256", secret).update(imageUrl).digest("base64url");
}

export function verifyImageSignature(imageUrl: string, sig: string | null, secret: string): boolean {
  if (!sig) return false;
  const expected = Buffer.from(signImageUrl(imageUrl, secret));
  const actual = Buffer.from(sig);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

/** プロキシ経由の同一オリジン画像URL (Annict 以外のホストの画像は混在コンテンツ回避にも使う) (外部サイトの CORP: same-origin を回避するため) */
export function ogImageProxyPath(imageUrl: string, secret: string): string {
  return `/api/og-image?u=${encodeURIComponent(imageUrl)}&sig=${signImageUrl(imageUrl, secret)}`;
}

/** Annict 自身の画像ホスト (CORP 制限がなくそのまま表示できる)。`annict.com.evil.com` のような類似ホストは含まない */
export function isAnnictImageUrl(imageUrl: string): boolean {
  try {
    const url = new URL(imageUrl);
    return url.protocol === "https:" && (url.hostname === "annict.com" || url.hostname.endsWith(".annict.com"));
  } catch {
    return false;
  }
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
