import type { AnnictWorks } from "@/app/types/annict";
import { toSafeHttpUrl, toSafeTwitterUsername } from "./safe-url";

export type Anime = {
  id: number;
  title: string;
  image: string;
  watchersCount: number;
  officialSiteUrl?: string;
  media: "TV" | "OVA" | "MOVIE" | "WEB";
  twitterUrl?: string;
};

export const PLACEHOLDER_IMAGE = "/placeholder.svg?w=300";

/** Annict は画像未登録の作品に共通の no-image.jpg を返すため、実画像として扱わない */
function toAnnictImageUrl(value: unknown): string | undefined {
  const url = toSafeHttpUrl(value);
  return url && !url.includes("no-image.jpg") ? url : undefined;
}

const MEDIA_TYPES = new Set<Anime["media"]>(["TV", "OVA", "MOVIE", "WEB"]);

/** Annict の作品データを画面表示用に変換し、外部由来のURLを検証する */
export function toAnime(work: AnnictWorks[number]): Anime | undefined {
  if (!Number.isSafeInteger(work?.annictId) || work.annictId <= 0) {
    return undefined;
  }
  return {
    id: work.annictId,
    title: typeof work.title === "string" ? work.title : "",
    media: MEDIA_TYPES.has(work.media) ? work.media : "TV",
    watchersCount: Number.isFinite(work.watchersCount) ? work.watchersCount : 0,
    officialSiteUrl: toSafeHttpUrl(work.officialSiteUrl),
    twitterUrl: toSafeTwitterUsername(work.twitterUsername),
    image:
      toAnnictImageUrl(work.image?.facebookOgImageUrl) ??
      toAnnictImageUrl(work.image?.recommendedImageUrl) ??
      PLACEHOLDER_IMAGE,
  };
}

export function toAnimeList(works: unknown): Anime[] {
  if (!Array.isArray(works)) return [];
  return works.flatMap((work) => toAnime(work) ?? []);
}
