import { VoteDeleteButton } from "@/components/vote-delete";
import { getAnimeByIds } from "@/lib/anime-data";
import { supabase } from "@/lib/supabaseClient";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { id = "" } = await searchParams;
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
  }));
  return (
    <div>
      <h1>Product Listing</h1>
      <p>reslut id {id}</p>
      <p>投票内容</p>
      <div className="grid gap-4 py-4">
        {/* animeListのanime情報と、supabaseからのannict_idに対応するcoin_valueとtotal_coin_valueを表示 */}
        {/* 自分の投票結果のcoin数も表示 */}
        {animeList.map((item) => {
          const coinValue = data.find(
            (coin) => coin.annict_id === item.id,
          )?.coin_value;
          const totalCoinValue = coins.find(
            (coin) => coin.annict_id === item.id,
          )?.total_coin_value;
          return (
            <div
              key={item.id}
              className="flex justify-between items-center border-b py-2"
            >
              <img
                src={item.image}
                alt={item.title}
                className="aspect-video w-96"
              />
              <span>{`${item.title}`}</span>
              <span>{`${item.watchersCount} watchers`}</span>
              <span>{`${coinValue} コイン`}</span>
              <span>{`${totalCoinValue} コイン`}</span>
            </div>
          );
        })}
        <VoteDeleteButton id={id} />
      </div>
    </div>
  );
}
