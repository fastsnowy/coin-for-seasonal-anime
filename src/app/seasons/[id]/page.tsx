import AnimeGrid from "@/components/anime-grid";
import { Breadcrumb } from "@/components/breadcrumb";
import RankingSection from "@/components/ranking-section";
import { BlurText } from "@/components/ui/blur-text";
import { Spinner } from "@/components/ui/spinner";
import { siteName } from "@/config/constant";
import { getAnimeByYearAndSeason } from "@/lib/anime-data";
import { getSeasonName, getSeasonType } from "@/lib/seasons";
import type { Season } from "@/lib/seasons";
import { DB_VIEWS } from "@/config/database";
import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { CloudOff } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";
import { getJSTDate } from "@/lib/date-utils";

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
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <div
          role="alert"
          className="mx-auto flex max-w-sm flex-col items-center gap-3 rounded-2xl border border-border bg-card px-6 py-12 text-center shadow-xs"
        >
          <span className="flex size-11 items-center justify-center rounded-full bg-destructive-muted text-destructive">
            <CloudOff className="size-5" aria-hidden="true" />
          </span>
          <p className="text-sm font-medium">データの取得に失敗しました</p>
          <p className="text-xs text-muted-foreground">
            時間をおいてページを再読み込みしてください
          </p>
        </div>
      </div>
    );
  }

  const heading = `${
    seasonType === "current"
      ? "今期"
      : seasonType === "next"
        ? "来期"
        : `${year}年 ${seasonName}`
  }のアニメ`;

  return (
    <div className="container mx-auto max-w-5xl px-4 pt-4 pb-8">
      <Breadcrumb items={[{ label: `${year}年 ${seasonName}` }]} />

      <header className="mb-6 mt-2">
        <p className="text-xs font-semibold tracking-[0.18em] text-coin-foreground uppercase">
          {year} {seasonName}
        </p>
        <BlurText
          as="h1"
          text={heading}
          by="char"
          className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
        />
        <p className="mt-1.5 text-sm text-muted-foreground">
          気になる作品にコインを賭けて、期待度を表明しよう。
        </p>
      </header>

      <RankingSection animeList={animeList} coins={coins} />

      <Suspense
        fallback={
          <output className="flex flex-col items-center gap-3 py-20">
            <Spinner className="size-5 text-coin" />
            <span className="text-xs text-shimmer">作品を読み込み中</span>
          </output>
        }
      >
        <AnimeGrid animeList={animeList} coins={coins} />
      </Suspense>
    </div>
  );
}
