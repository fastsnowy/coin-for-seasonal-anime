import "server-only";

import { GET_ANIME_DETAILS, GET_ANIME_DETAILS_BY_IDS } from "@/gql";
import { type Anime, toAnimeList } from "./annict-works";

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
  return toAnimeList(json.data?.searchWorks?.nodes);
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
