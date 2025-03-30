import AnimeGrid from "@/components/anime-grid";
import RankingSection from "@/components/ranking-section";
import SeasonNavigation from "@/components/season-navigation";
import { siteName } from "@/config/constant";
import { getAnimeByYearAndSeason } from "@/lib/anime-data";
import { getSeasonName, getSeasonType } from "@/lib/seasons";
import type { Season } from "@/lib/seasons";
import { supabase } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";
import { Suspense } from "react";

// 動的パラメータの生成（静的生成するパスを指定）
export async function generateStaticParams() {
  const currentYear = new Date().getFullYear();
  return [
    { id: `${currentYear}-winter` },
    { id: `${currentYear}-spring` },
    { id: `${currentYear}-summer` },
    { id: `${currentYear}-autumn` },
  ];
}

export const dynamicParams = true;

export const revalidate = 360;

export default async function SeasonPage({
  params,
}: { params: Promise<{ id: string }> }) {
  // URLパラメータから年と季節を取得
  const { id } = await params;
  const match = id.match(/^(\d{4})-(spring|summer|autumn|winter)$/);

  if (!match) {
    notFound();
  }

  const year = Number.parseInt(match[1]);
  const season = match[2] as Season;
  const seasonName = getSeasonName(season);
  const seasonType = getSeasonType(year, season);

  // サーバーサイドでアニメデータを取得

  const animeList = await getAnimeByYearAndSeason(year, season);

  // supabaseからデータを取得
  const { data: coins, error } = await supabase
    .from("dev_coin_value_view")
    .select("annict_id, total_coin_value, uu")
    .eq("season", `${year}-${season}`)
    .order("total_coin_value", { ascending: false });
  if (error) {
    console.error("Failed to fetch total coin data", error);
  }

  if (!coins) {
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">{siteName}</h1>
        <SeasonNavigation />
        <div className="text-center py-10">データの取得に失敗しました</div>
      </main>
    );
  }
  const top3Coins = coins.slice(0, 3);
  const top3Anime = top3Coins.map((coin) => {
    const anime = animeList.find((anime) => anime.id === coin.annict_id);
    return {
      ...anime,
      total_coin_value: coin.total_coin_value,
      uu: coin.uu,
    };
  });

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">{siteName}</h1>

      <SeasonNavigation />

      <div className="my-6">
        <h2 className="text-2xl font-semibold text-center">
          {seasonType === "current"
            ? "今期"
            : seasonType === "next"
              ? "来期"
              : `${year}年 ${seasonName}`}
          のアニメ
        </h2>
      </div>
      {/* ranking */}
      <div className="my-6">
        <RankingSection animeList={animeList} />
      </div>
      <Suspense
        fallback={<div className="text-center py-10">読み込み中...</div>}
      >
        <AnimeGrid animeList={animeList} coins={coins} />
      </Suspense>
    </main>
  );
}
