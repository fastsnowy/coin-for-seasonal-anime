import AnimeGrid from "@/components/anime-grid";
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
    { id: `${currentYear}-spring` },
    // { id: `${currentYear}-summer` },
    // { id: `${currentYear}-autumn` },
    // { id: `${currentYear}-winter` },
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
  let animeList;
  try {
    animeList = await getAnimeByYearAndSeason(year, season);
  } catch (error) {
    console.error("Failed to fetch anime data", error);
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">{siteName}</h1>
        <SeasonNavigation currentYear={year} currentSeason={season} />
        <div className="text-center py-10">データの取得に失敗しました</div>
      </main>
    );
  }
  // supabaseからデータを取得
  const { data: coins, error } = await supabase
    .from("total_coin_value_view")
    .select("annict_id, total_coin_value")
    .eq("season", `${year}-${season}`);
  if (error) {
    console.error("Failed to fetch total coin data", error);
  }

  if (!coins) {
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">{siteName}</h1>
        <SeasonNavigation currentYear={year} currentSeason={season} />
        <div className="text-center py-10">データの取得に失敗しました</div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">{siteName}</h1>

      <SeasonNavigation currentYear={year} currentSeason={season} />

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

      <Suspense
        fallback={<div className="text-center py-10">読み込み中...</div>}
      >
        <AnimeGrid animeList={animeList} coins={coins} />
      </Suspense>
    </main>
  );
}
