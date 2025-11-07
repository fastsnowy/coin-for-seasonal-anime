import type { Anime } from "@/lib/anime-data";
import { Coins, Eye, Trophy, Medal, Award } from "lucide-react";

interface RankingItemProps {
  rank: number;
  anime: Anime & { watchers: number; coins: number };
}

function RankingItem({ rank, anime }: RankingItemProps) {
  // ランクに応じてアイコンを表示
  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="flex items-center justify-center w-8 h-8">
            <Trophy className="h-5 w-5 text-yellow-500" />
          </div>
        );
      case 2:
        return (
          <div className="flex items-center justify-center w-8 h-8">
            <Medal className="h-5 w-5 text-gray-400" />
          </div>
        );
      case 3:
        return (
          <div className="flex items-center justify-center w-8 h-8">
            <Award className="h-5 w-5 text-amber-600" />
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center w-8 h-8 text-sm font-semibold text-muted-foreground">
            {rank}
          </div>
        );
    }
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
  coins: {
    annict_id: number | null;
    total_coin_value: number | null;
    uu: number | null;
  }[];
}

export default function RankingSection({ animeList, coins }: RankingSectionProps) {
  // 実際のコインデータを使用
  const animeWithStats = animeList.map((anime) => ({
    ...anime,
    watchers: anime.watchersCount,
    coins: coins.find((c) => c.annict_id === anime.id)?.total_coin_value || 0,
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
