import AnimeGrid from "@/components/anime-grid";
import { Breadcrumb } from "@/components/breadcrumb";
import RankingSection from "@/components/ranking-section";
import SeasonNavigation from "@/components/season-navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { siteName } from "@/config/constant";
import { getAnimeByYearAndSeason } from "@/lib/anime-data";
import { getSeasonName, getSeasonType } from "@/lib/seasons";
import type { Season } from "@/lib/seasons";
import { supabase } from "@/lib/supabaseClient";
import { DB_VIEWS } from "@/config/database";
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
    title: `${year} ${seasonName}アニメ | ${siteName}`,
  };
}

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
  const { id } = await params;
  const match = id.match(/^(\d{4})-(spring|summer|autumn|winter)$/);
  if (!match) notFound();

  const year = Number.parseInt(match[1]);
  const season = match[2] as Season;
  const seasonName = getSeasonName(season);
  const seasonType = getSeasonType(year, season);

  const animeList = await getAnimeByYearAndSeason(year, season);

  const { data: coins, error } = await supabase
    .from(DB_VIEWS.COIN_VALUE)
    .select("annict_id, total_coin_value, uu")
    .eq("season", `${year}-${season}`)
    .order("total_coin_value", { ascending: false });

  if (error) console.error("Failed to fetch total coin data", error);

  if (!coins) {
    return (
      <main className="min-h-dvh flex flex-col items-center justify-center px-4">
        <p className="text-muted-foreground">データの取得に失敗しました</p>
      </main>
    );
  }

  const seasonLabel =
    seasonType === "current"
      ? "今期"
      : seasonType === "next"
        ? "来期"
        : `${year}年 ${seasonName}`;

  return (
    <main className="min-h-dvh bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto max-w-5xl px-4 h-12 flex items-center justify-between gap-3">
          <h1 className="text-sm font-bold truncate">{siteName}</h1>
          <div className="flex items-center gap-1.5">
            <SeasonNavigation />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-5xl px-4 pt-4 pb-8">
        <Breadcrumb items={[{ label: `${year}年 ${seasonName}` }]} />

        <h2 className="text-center text-sm text-muted-foreground mb-5">
          {seasonLabel}のアニメ
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
