import type { Anime } from "@/lib/anime-data";
import { Coins, Eye } from "lucide-react";

interface RankingItemProps {
  rank: number;
  anime: Anime & { watchers: number; coins: number };
}

function RankingItem({ rank, anime }: RankingItemProps) {
  // ランクに応じてメダルアイコンを表示
  const getRankBadge = (rank: number) => {
    const medals = ["🥇", "🥈", "🥉"];
    if (rank <= 3) {
      return (
        <div className="flex items-center justify-center w-8 h-8 text-lg">
          {medals[rank - 1]}
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center w-8 h-8 text-sm font-semibold text-muted-foreground">
        {rank}
      </div>
    );
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
      {getRankBadge(rank)}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm line-clamp-1 mb-1">
          {anime.title}
        </h3>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {anime.coins > 0 && (
            <div className="flex items-center gap-1">
              <Coins className="h-3 w-3" />
              <span>{anime.coins.toLocaleString()}</span>
            </div>
          )}
          {anime.watchers > 0 && (
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{anime.watchers.toLocaleString()}</span>
            </div>
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
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* コイン総数ランキング */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Coins className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold text-sm">コイン総数 TOP3</h3>
          </div>
          <div className="space-y-1">
            {coinRanking.map((anime, index) => (
              <RankingItem key={anime.id} rank={index + 1} anime={anime} />
            ))}
          </div>
        </div>

        {/* 視聴者数ランキング */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Eye className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold text-sm">視聴者数 TOP3</h3>
          </div>
          <div className="space-y-1">
            {watcherRanking.map((anime, index) => (
              <RankingItem key={anime.id} rank={index + 1} anime={anime} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
