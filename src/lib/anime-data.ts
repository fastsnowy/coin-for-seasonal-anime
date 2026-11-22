import "server-only";

import { GET_ANIME_DETAILS, GET_ANIME_DETAILS_BY_IDS } from "@/gql";
import { type Anime, PLACEHOLDER_IMAGE, toAnimeList } from "./annict-works";
import { fetchOgImageUrl } from "./og-image";
import { isAnnictImageUrl, ogImageProxyPath } from "./og-image-proxy";
import { getOgImageProxySecret } from "./og-image-secret";

export type { Anime } from "./annict-works";

const ANNICT_GRAPHQL_URL = "https://api.annict.com/graphql";
const ANNICT_TIMEOUT_MS = 10_000;

async function fetchAnnictWorks(body: { query: string }): Promise<Anime[]> {
  const token = process.env.ANNICT_TOKEN;
  if (!token) {
    throw new Error("ANNICT_TOKEN is not configured");
  }

  const res = await fetch(ANNICT_GRAPHQL_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
    // トークン付きリクエストが別ホストへ転送されないようにする
    redirect: "error",
    signal: AbortSignal.timeout(ANNICT_TIMEOUT_MS),
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch Annict data: ${res.status}`);
  }

  const json = (await res.json()) as {
    data?: { searchWorks?: { nodes?: unknown } };
  };
  return withOfficialSiteImages(toAnimeList(json.data?.searchWorks?.nodes));
}

const OGP_FETCH_CONCURRENCY = 8;

/**
 * 画像URLを整える。
 * - Annict に画像が無い作品は公式サイトの OGP 画像で補完する
 * - Annict 以外のホストの画像 (公式サイトの OGP 等) は、CORP: same-origin や http による
 *   ブラウザ側のブロックを避けるため、署名付きの同一オリジンプロキシ経由にする
 */
async function withOfficialSiteImages(animes: Anime[]): Promise<Anime[]> {
  const secret = getOgImageProxySecret();
  const result = animes.map((anime) =>
    anime.image !== PLACEHOLDER_IMAGE && !isAnnictImageUrl(anime.image)
      ? { ...anime, image: ogImageProxyPath(anime.image, secret) }
      : anime,
  );
  const targets = result.flatMap((anime, index) =>
    anime.image === PLACEHOLDER_IMAGE && anime.officialSiteUrl ? [index] : [],
  );
  let cursor = 0;
  const worker = async () => {
    while (cursor < targets.length) {
      const index = targets[cursor++];
      const image = await fetchOgImageUrl(result[index].officialSiteUrl as string);
      if (image) result[index] = { ...result[index], image: ogImageProxyPath(image, secret) };
    }
  };
  await Promise.all(Array.from({ length: Math.min(OGP_FETCH_CONCURRENCY, targets.length) }, worker));
  return result;
}

// 指定された年と季節のアニメを取得する関数
export function getAnimeByYearAndSeason(
  year: number,
  season: string,
): Promise<Anime[]> {
  return fetchAnnictWorks(GET_ANIME_DETAILS(`${year}-${season}`));
}

export function getAnimeByIds(annictIds: number[]): Promise<Anime[]> {
  return fetchAnnictWorks(GET_ANIME_DETAILS_BY_IDS(annictIds));
}
