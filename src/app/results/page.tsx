import { ResultsClient } from "@/components/results-client";
import { CoinTotal } from "@/components/ui/coin-total";
import { Breadcrumb } from "@/components/breadcrumb";
import { DB_VIEWS } from "@/config/database";
import { getAnimeByIds } from "@/lib/anime-data";
import { createSupabaseServerClient } from "@/lib/supabaseClient";
import type { Metadata } from "next";
import { siteName } from "@/config/constant";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import Link from "next/link";
import { Coins, SearchX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getSeasonName, type Season } from "@/lib/seasons";
import { ShareButtons } from "@/components/share-buttons";

function ErrorPage({
  message,
  description,
  actionHref = "/",
  actionLabel = "トップページに戻る",
}: {
  message: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <main className="min-h-dvh bg-background">
      <SiteHeader maxWidth="max-w-4xl" />
      <div className="container mx-auto max-w-4xl px-4 py-6">
        <Breadcrumb items={[{ label: "投票結果" }]} />
        <div className="stagger-children mx-auto flex max-w-md flex-col items-center gap-6 py-20 text-center sm:py-28">
          <div className="flex size-14 items-center justify-center rounded-2xl border border-border bg-surface-sunken shadow-[var(--highlight-inset)]">
            <SearchX className="size-6 text-muted-foreground" aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-bold tracking-tight">{message}</h1>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>
          <div className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row">
            <Button asChild variant="solid" size="md">
              <Link href={actionHref}>{actionLabel}</Link>
            </Button>
            {actionHref !== "/" && (
              <Button asChild variant="outline" size="md">
                <Link href="/">トップページに戻る</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}): Promise<Metadata> {
  const { id = "" } = await searchParams;
  const supabase = await createSupabaseServerClient();

  const { data } = await supabase
    .from(DB_VIEWS.PUBLIC_COINS)
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
  const seasonText = seasonMatch
    ? `${year}年${seasonNameText}アニメ`
    : "アニメ";
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
  const { id } = await searchParams;
  const supabase = await createSupabaseServerClient();

  if (!id) {
    return (
      <ErrorPage
        message="投票結果のIDが指定されていません"
        description="履歴から結果を開くか、URLをご確認ください。"
        actionHref="/my-votes"
        actionLabel="投票履歴を見る"
      />
    );
  }

  const { data, error } = await supabase
    .from(DB_VIEWS.PUBLIC_COINS)
    .select("annict_id, coin_value, season")
    .eq("created_id", id);

  if (!data || error || data.length === 0) {
    return (
      <ErrorPage
        message="投票データが見つかりませんでした"
        description="投票が削除されたか、URLが正しくない可能性があります。"
        actionHref="/my-votes"
        actionLabel="投票履歴を見る"
      />
    );
  }
  const [firstVote] = data;
  if (!firstVote?.season) {
    return (
      <ErrorPage
        message="投票データが見つかりませんでした"
        description="投票が削除されたか、URLが正しくない可能性があります。"
        actionHref="/my-votes"
        actionLabel="投票履歴を見る"
      />
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
      <ErrorPage
        message="データの取得に失敗しました"
        description="時間をおいて再度お試しください。"
      />
    );
  }

  const votedAnnictIds = data
    .map((item) => item.annict_id)
    .filter((annictId): annictId is number => annictId !== null);
  const res = await getAnimeByIds(votedAnnictIds);

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
  const seasonText = seasonMatch
    ? `${year}年${seasonNameText}アニメ`
    : "アニメ";
  const shareText = `${seasonText}に合計${totalCoins}枚のコインを賭けました！\n\n#anicoy\n`;

  return (
    <main className="min-h-dvh bg-background">
      <SiteHeader maxWidth="max-w-4xl" />

      <div className="container mx-auto max-w-4xl px-4 py-6 pb-20">
        <Breadcrumb items={[{ label: "投票結果" }]} />

        {/* Summary */}
        <section
          aria-labelledby="result-heading"
          className="relative isolate mt-6 mb-10 overflow-hidden rounded-2xl surface px-5 py-10 text-center sm:mt-8 sm:py-14"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_50%_0%,var(--coin-muted),transparent_70%)]"
          />
          <div className="stagger-children flex flex-col items-center gap-4">
            <Badge variant="soft" className="h-6 px-2.5">
              <Coins aria-hidden="true" />
              {seasonText}
            </Badge>
            <h1
              id="result-heading"
              className="flex flex-col items-center gap-1 font-extrabold tracking-tight"
            >
              <span className="flex items-baseline gap-1.5 text-coin-foreground">
                <CoinTotal
                  value={totalCoins}
                  className="text-5xl leading-none sm:text-6xl"
                />
                <span className="text-xl sm:text-2xl">枚</span>
              </span>
              <span className="text-lg sm:text-xl">のコインを賭けました！</span>
            </h1>
            <p className="text-xs text-muted-foreground tabular-nums">
              {animeList.length}作品に投票
            </p>
          </div>
        </section>

        <ResultsClient
          animeList={animeList}
          coins={coins}
          id={id}
          votedCoins={data}
        />

        <section
          aria-labelledby="share-heading"
          className="mt-12 flex flex-col items-center gap-4 rounded-2xl border border-border bg-surface-sunken px-4 py-8 sm:mt-16"
        >
          <div className="space-y-1 text-center">
            <h2 id="share-heading" className="text-sm font-semibold">
              この結果をシェアする
            </h2>
            <p className="text-xs text-muted-foreground">
              あなたの期待度を友達と共有しましょう
            </p>
          </div>
          <ShareButtons shareText={shareText} />
        </section>
      </div>
    </main>
  );
}
