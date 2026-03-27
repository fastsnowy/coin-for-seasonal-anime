import { ResultsClient } from "@/components/results-client";
import { Breadcrumb } from "@/components/breadcrumb";
import { VoteDeleteWrapper } from "@/components/vote-delete-wrapper";
import { DB_TABLES, DB_VIEWS } from "@/config/database";
import { getAnimeByIds } from "@/lib/anime-data";
import { createSupabaseServerClient } from "@/lib/supabaseClient";
import type { Metadata } from "next";
import { siteName } from "@/config/constant";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { getSeasonName, type Season } from "@/lib/seasons";
import { ShareButtons } from "@/components/share-buttons";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}): Promise<Metadata> {
  const { id = "" } = await searchParams;
  const supabase = createSupabaseServerClient();

  const { data } = await supabase
    .from(DB_TABLES.COINS)
    .select("coin_value, season")
    .eq("created_id", id);

  if (!data || data.length === 0) {
    return { title: `投票結果 | ${siteName}` };
  }

  const totalCoins = data.reduce(
    (acc, item) => acc + (item.coin_value ?? 0),
    0,
  );

  const firstVote = data[0];
  const seasonMatch = firstVote?.season?.match(
    /^(\d{4})-(spring|summer|autumn|winter)$/,
  );
  const year = seasonMatch ? seasonMatch[1] : "";
  const season = seasonMatch ? (seasonMatch[2] as Season) : "spring";
  const seasonNameText = seasonMatch ? getSeasonName(season) : "";
  const seasonText = seasonMatch ? `${year}年${seasonNameText}アニメ` : "アニメ";
  const titleText = `${seasonText}に合計${totalCoins}枚のコインを賭けました！`;

  return {
    title: `${titleText} | ${siteName}`,
  };
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { id = "" } = await searchParams;
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from(DB_TABLES.COINS)
    .select("*")
    .eq("created_id", id);

  if (!data || error) {
    return (
      <main className="min-h-dvh bg-background flex flex-col items-center justify-center px-4">
        <p className="text-muted-foreground">データの取得に失敗しました</p>
      </main>
    );
  }
  const [firstVote] = data;
  if (!firstVote?.season) {
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          データの取得に失敗しました
        </h1>
        <div className="text-center py-10">データの取得に失敗しました</div>
      </main>
    );
  }

  const { data: coins, error: coinError } = await supabase
    .from(DB_VIEWS.COIN_VALUE)
    .select("annict_id, total_coin_value, uu")
    .eq("season", firstVote.season)
    .order("total_coin_value", { ascending: false });

  if (coinError) console.error("Failed to fetch total coin data", coinError);

  if (!coins) {
    return (
      <main className="min-h-dvh bg-background flex flex-col items-center justify-center px-4">
        <p className="text-muted-foreground">データの取得に失敗しました</p>
      </main>
    );
  }

  const votedAnnictIds = data
    .map((item) => item.annict_id)
    .filter((annictId): annictId is number => annictId !== null);
  const res = await getAnimeByIds(votedAnnictIds);
  const deleteId =
    "delete_id" in firstVote && typeof firstVote.delete_id === "string"
      ? firstVote.delete_id
      : "";

  const animeList = res.map((anime) => ({
    id: anime.id,
    title: anime.title,
    image: anime.image,
    watchersCount: anime.watchersCount,
    officialSiteUrl: anime.officialSiteUrl,
    media: anime.media,
    twitterUrl: anime.twitterUrl,
  }));

  const totalCoins = data.reduce(
    (acc, item) => acc + ((item.coin_value as number) || 0),
    0,
  );

  const seasonMatch = firstVote.season.match(
    /^(\d{4})-(spring|summer|autumn|winter)$/,
  );
  const year = seasonMatch ? seasonMatch[1] : "";
  const season = seasonMatch ? (seasonMatch[2] as Season) : "spring";
  const seasonNameText = seasonMatch ? getSeasonName(season) : "";
  const seasonText = seasonMatch ? `${year}年${seasonNameText}アニメ` : "アニメ";
  const shareText = `${seasonText}に合計${totalCoins}枚のコインを賭けました！\n\n#季節アニメコイン\n`;

  return (
    <main className="min-h-dvh bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto max-w-4xl px-4 h-12 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm font-bold hover:text-foreground transition-colors"
          >
            {siteName}
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <div className="container mx-auto max-w-4xl px-4 py-6 pb-20">
        <Breadcrumb items={[{ label: "投票結果" }]} />

        <div className="mt-8 mb-10 text-center space-y-2">
          <p className="text-xs font-bold text-muted-foreground tracking-widest uppercase opacity-70">
            {seasonText}
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            <span className="text-coin px-1">{totalCoins}枚</span>のコインを賭けました！
          </h1>
        </div>

        <ResultsClient
          animeList={animeList}
          coins={coins}
          id={id}
          votedCoins={data}
        />

        <div className="mt-16 pt-10 border-t border-border/50">
          <div className="flex flex-col items-center gap-8">
            <div className="flex flex-col items-center gap-4 w-full">
              <p className="text-sm font-bold text-muted-foreground">この結果をシェアする</p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <ShareButtons shareText={shareText} />
                <VoteDeleteWrapper voteId={id} deleteId={deleteId} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
