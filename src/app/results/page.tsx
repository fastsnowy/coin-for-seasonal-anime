import { ResultsClient } from "@/components/results-client";
import { Breadcrumb } from "@/components/breadcrumb";
import { VoteDeleteWrapper } from "@/components/vote-delete-wrapper";
import { DB_TABLES, DB_VIEWS } from "@/config/database";
import { getAnimeByIds } from "@/lib/anime-data";
import { createSupabaseServerClient } from "@/lib/supabaseClient";
import type { Metadata } from "next";
import { siteName } from "@/config/constant";
import { ThemeToggle } from "@/components/theme-toggle";
import { Coins } from "lucide-react";
import Link from "next/link";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}): Promise<Metadata> {
  const { id = "" } = await searchParams;
  const supabase = createSupabaseServerClient();

  const { data } = await supabase
    .from(DB_TABLES.COINS)
    .select("coin_value")
    .eq("created_id", id);

  if (!data || data.length === 0) {
    return { title: `投票結果 | ${siteName}` };
  }

  const totalCoins = data.reduce(
    (acc, item) => acc + (item.coin_value ?? 0),
    0,
  );

  return {
    title: `${totalCoins}枚のコインを投票しました | ${siteName}`,
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
        <div className="container mx-auto max-w-4xl px-4 pb-5 text-center space-y-3">
          <h1 className="text-xl font-bold">投票結果</h1>
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-coin-muted border border-coin/15">
            <Coins className="w-5 h-5 text-coin" />
            <span className="font-bold text-2xl text-coin tabular-nums">
              {totalCoins}
            </span>
            <span className="text-sm text-muted-foreground">コイン</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-4xl px-4 py-6">
        <Breadcrumb items={[{ label: "投票結果" }]} />

        <ResultsClient
          animeList={animeList}
          coins={coins}
          id={id}
          votedCoins={data}
        />

        <VoteDeleteWrapper voteId={id} deleteId={deleteId} />
      </div>
    </main>
  );
}
