import type { AnnictWorks } from "@/app/types/annict";
import { GET_ANIME_DETAILS } from "@/gql";

export type Anime = {
  id: number;
  title: string;
  image: string;
  watchersCount: number;
  officialSiteUrl: string;
  media: "TV" | "OVA" | "MOVIE" | "WEB";
  twitterUrl: string;
};

function getNextSeason() {
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();
  if (month >= 3 && month <= 5) return { id: "summer", name: "夏", year: year };
  if (month >= 6 && month <= 8) return { id: "autumn", name: "秋", year: year };
  if (month >= 9 && month <= 11)
    return { id: "winter", name: "冬", year: year };
  return { id: "spring", name: "春", year: year + 1 };
}

// 指定された年と季節のアニメを取得する関数
export async function getAnimeByYearAndSeason(
  year: number,
  season: string,
): Promise<Anime[]> {
  // if (!client.api.annict) {
  //   throw new Error("API client is not properly initialized")
  // }
  // const res = await client.api.annict[":season"].$get({ param: { season: `${year}-${season}` } })
  // if (!res.ok) {
  //   throw new Error("Failed to fetch data")
  // }
  // const data = await res.json()

  // console.log(data)

  const res = await fetch("https://api.annict.com/graphql", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${process.env.ANNICT_TOKEN}`,
    },
    body: JSON.stringify(GET_ANIME_DETAILS(`${year}-${season}`)),
  });
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  const {
    data: {
      searchWorks: { nodes: data },
    },
  } = (await res.json()) as { data: { searchWorks: { nodes: AnnictWorks } } };

  // APIから取得したデータをAnime型の配列に変換
  const animeList: Anime[] = data.map((anime) => ({
    id: anime.annictId,
    title: anime.title,
    media: anime.media,
    watchersCount: anime.watchersCount,
    officialSiteUrl: anime.officialSiteUrl,
    twitterUrl: anime.twitterUsername,
    facebookOgImageUrl: anime.image?.facebookOgImageUrl,
    recommendedImageUrl: anime.image?.recommendedImageUrl,
    image:
      anime.image?.facebookOgImageUrl ||
      anime.image?.recommendedImageUrl ||
      "/placeholder.svg?w=300",
  }));

  return animeList;
}
