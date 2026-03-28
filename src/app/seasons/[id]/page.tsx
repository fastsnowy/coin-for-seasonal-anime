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
import { getJSTDate } from "@/lib/date-utils";


import { SiteHeader } from "@/components/site-header";

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
  const currentYear = getJSTDate().getFullYear();
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
  const supabase = await createSupabaseServerClient();
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
    <main className="min-h-dvh bg-background">
      <SiteHeader maxWidth="max-w-5xl">
        <div className="flex-1 overflow-x-auto no-scrollbar">
          <SeasonNavigation />
        </div>
      </SiteHeader>

      <div className="container mx-auto max-w-5xl px-4 pt-4 pb-8">
        <Breadcrumb items={[{ label: `${year}年 ${seasonName}` }]} />

        <h2 className="text-center text-sm text-muted-foreground mb-5">
          {seasonType === "current"
            ? "今期"
            : seasonType === "next"
              ? "来期"
              : `${year}年 ${seasonName}`}
          のアニメ
        </h2>

        <RankingSection animeList={animeList} coins={coins} />

        <Suspense
          fallback={
            <div className="flex flex-col items-center py-20 gap-3">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-r-transparent" />
              <p className="text-xs text-muted-foreground">読み込み中...</p>
            </div>
          }
        >
          <AnimeGrid animeList={animeList} coins={coins} />
        </Suspense>
      </div>
    </main>
  );
}
