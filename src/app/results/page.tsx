import { VoteDeleteButton } from "@/components/vote-delete";
import { getAnimeByIds } from "@/lib/anime-data";
import { supabase } from "@/lib/supabaseClient";
import { AnimeCard } from "@/components/anime-card";
import { Breadcrumb } from "@/components/breadcrumb";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { id = "", did = "" } = await searchParams;
  // supabaseから投票内容取得
  const { data, error } = await supabase
    .from("dev_coins") // TODO: dev
    .select("*")
    .eq("created_id", id);

  // annictからanime情報取得
  if (!data) {
    return <div className="text-center py-10">データの取得に失敗しました</div>;
  }
  const { data: coins, error: coinError } = await supabase
    .from("dev_coin_value_view") // TODO: dev
    .select("annict_id, total_coin_value, uu")
    .eq("season", data[0].season as string)
    .order("total_coin_value", { ascending: false });
  const res = await getAnimeByIds(data.map((item) => item.annict_id as number));

  if (coinError) {
    console.error("Failed to fetch total coin data", coinError);
  }
  if (!coins) {
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          データの取得に失敗しました
        </h1>
        <div className="text-center py-10">データの取得に失敗しました</div>
      </main>
    );
  }

  const animeList = res.map((anime) => ({
    id: anime.id,
    title: anime.title,
    image: anime.image,
    watchersCount: anime.watchersCount,
    officialSiteUrl: anime.officialSiteUrl,
    media: anime.media,
    twitterUrl: anime.twitterUrl,
  }));

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* ヘッダー */}
      <div className="border-b border-border/50 bg-background/80 backdrop-blur">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-2">
            投票結果
          </h1>
          <p className="text-center text-muted-foreground text-sm">
            あなたの期待度が記録されました
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* パンくずリスト */}
        <Breadcrumb
          items={[
            {
              label: "投票結果",
            },
          ]}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-24">
          {animeList.map((anime) => (
            <AnimeCard
              work={anime}
              key={anime.id}
              coins={coins}
              isVoted={true}
              votedCoins={data}
            />
          ))}
        </div>
        
        {did === data[0].delete_id && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2">
            <VoteDeleteButton id={id} />
          </div>
        )}
      </div>
    </main>
  );
}
