import type { Anime } from "@/lib/anime-data";
import { Coins, Eye } from "lucide-react";

interface RankingItemProps {
  rank: number;
  anime: Anime & { watchers: number; coins: number };
}

function RankingItem({ rank, anime }: RankingItemProps) {
  // ランクに応じた背景色を設定
  const getBgColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-100 border-yellow-300";
      case 2:
        return "bg-gray-100 border-gray-300";
      case 3:
        return "bg-amber-100 border-amber-300";
      default:
        return "bg-white border-gray-200";
    }
  };

  // ランクに応じたバッジの色を設定
  const getBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-400";
      case 2:
        return "bg-gray-400";
      case 3:
        return "bg-amber-600";
      default:
        return "bg-gray-200";
    }
  };

  return (
    <div
      className={`p-4 rounded-lg border ${getBgColor(rank)} mb-4 flex items-center`}
    >
      <div
        className={`${getBadgeColor(rank)} text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mr-4`}
      >
        {rank}
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-black line-clamp-1">{anime.title}</h3>
        <div className="flex items-center gap-4 mt-1">
          {rank <= 3 && (
            <>
              {anime.coins > 0 && (
                <div className="flex items-center text-yellow-600">
                  <Coins className="h-4 w-4 mr-1" />
                  <span>{anime.coins} coins</span>
                </div>
              )}
              {anime.watchers > 0 && (
                <div className="flex items-center text-blue-600">
                  <Eye className="h-4 w-4 mr-1" />
                  <span>{anime.watchers} watchers</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

interface RankingSectionProps {
  animeList: Anime[];
}

export default function RankingSection({ animeList }: RankingSectionProps) {
  // デモ用にランダムな視聴者数とコイン数を割り当て
  const animeWithStats = animeList.map((anime) => ({
    ...anime,
    watchers: anime.watchersCount,
    coins: Math.floor(Math.random() * 1000),
  }));

  // コイン数でソート
  const coinRanking = [...animeWithStats]
    .sort((a, b) => b.coins - a.coins)
    .slice(0, 3);

  // 視聴者数でソート
  const watcherRanking = [...animeWithStats]
    .sort((a, b) => b.watchers - a.watchers)
    .slice(0, 3);

  return (
    <div className="mb-12 bg-white text-black p-6 rounded-lg">
      <h2 className="text-xl font-bold text-center mb-6">
        <span className="text-yellow-500">✨</span> ランキング{" "}
        <span className="text-yellow-500">✨</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* コイン総数ランキング */}
        <div>
          <h3 className="font-bold mb-4 flex items-center">
            <Coins className="h-5 w-5 text-yellow-500 mr-2" />
            コイン総数トップ3
          </h3>

          {coinRanking.map((anime, index) => (
            <RankingItem key={anime.id} rank={index + 1} anime={anime} />
          ))}
        </div>

        {/* 視聴者数ランキング */}
        <div>
          <h3 className="font-bold mb-4 flex items-center">
            <Eye className="h-5 w-5 text-blue-500 mr-2" />
            視聴者数トップ3
          </h3>

          {watcherRanking.map((anime, index) => (
            <RankingItem key={anime.id} rank={index + 1} anime={anime} />
          ))}
        </div>
      </div>
    </div>
  );
}
