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

/** プロキシ経由の同一オリジン画像URL (外部サイトの CORP: same-origin を回避するため) */
export function ogImageProxyPath(siteUrl: string): string {
  return `/api/og-image?site=${encodeURIComponent(siteUrl)}`;
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
