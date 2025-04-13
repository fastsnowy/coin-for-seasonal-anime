import { VoteDeleteButton } from "@/components/vote-delete";
import { getAnimeByIds } from "@/lib/anime-data";
import { supabase } from "@/lib/supabaseClient";
import { AnimeCard } from "@/components/anime-card";

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
    <main className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-24">
        {animeList.map((anime) => (
          <AnimeCard
            work={anime}
            key={anime.id}
            coins={coins}
            isVoted={true} // 投票済みの状態を示す
            votedCoins={data} // 投票
          />
        ))}
      </div>
      {did === data[0].delete_id && <VoteDeleteButton id={id} />}
    </main>
  );
}
