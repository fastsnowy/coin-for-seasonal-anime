import AnimeGrid from "@/components/anime-grid";
import { Breadcrumb } from "@/components/breadcrumb";
import RankingSection from "@/components/ranking-section";
import SeasonNavigation from "@/components/season-navigation";
import { siteName } from "@/config/constant";
import { getAnimeByYearAndSeason } from "@/lib/anime-data";
import { getSeasonName, getSeasonType } from "@/lib/seasons";
import type { Season } from "@/lib/seasons";
import { DB_VIEWS } from "@/config/database";
import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const match = id.match(/^(\d{4})-(spring|summer|autumn|winter)$/);

  if (!match) return { title: siteName };

  const year = match[1];
  const season = match[2] as Season;
  const seasonName = getSeasonName(season);

  return {
    title: `${year} ${seasonName}アニメ一覧 | ${siteName}`,
  };
}

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
  const supabase = createSupabaseServerClient();
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
    .from(DB_VIEWS.COIN_VALUE)
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
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* ヘッダー */}
      <div className="border-b border-border/50 bg-background/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-center sm:text-left">
              {siteName}
            </h1>
            <SeasonNavigation />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* パンくずリスト */}
        <Breadcrumb
          items={[
            {
              label: `${year}年 ${seasonName}`,
            },
          ]}
        />

        <div className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-center text-muted-foreground">
            {seasonType === "current"
              ? "今期"
              : seasonType === "next"
                ? "来期"
                : `${year}年 ${seasonName}`}
            のアニメ
          </h2>
        </div>

        {/* ranking */}
        <RankingSection animeList={animeList} coins={coins} />

        <Suspense
          fallback={
            <div className="text-center py-20">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
              <p className="mt-4 text-muted-foreground">読み込み中...</p>
            </div>
          }
        >
          <AnimeGrid animeList={animeList} coins={coins} />
        </Suspense>
      </div>
    </main>
  );
}
