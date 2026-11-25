import "server-only";

import { createHmac, randomBytes } from "node:crypto";

let processSecret: string | undefined;

/**
 * OGP 画像プロキシの署名鍵 (サーバー専用)。
 * OG_IMAGE_PROXY_SECRET -> ANNICT_TOKEN から派生 -> プロセス毎のランダム値 の順。
 * ランダム値はインスタンス間で一致しないため、本番では OG_IMAGE_PROXY_SECRET の設定を推奨。
 */
export function getOgImageProxySecret(): string {
  const configured = process.env.OG_IMAGE_PROXY_SECRET;
  if (configured) return configured;
  const annictToken = process.env.ANNICT_TOKEN;
  if (annictToken) return createHmac("sha256", annictToken).update("anicoy:og-image-proxy").digest("hex");
  processSecret ??= randomBytes(32).toString("hex");
  return processSecret;
}
