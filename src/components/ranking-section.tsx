import type { Anime } from "@/lib/anime-data";
import { cn } from "@/lib/utils";
import { Award, Coins, Eye, Medal, Trophy } from "lucide-react";

interface RankingSectionProps {
  animeList: Anime[];
  coins: {
    annict_id: number | null;
    total_coin_value: number | null;
    uu: number | null;
  }[];
}

const rankConfig = [
  { icon: Trophy, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  { icon: Award, color: "text-gray-400", bg: "bg-gray-400/10" },
  { icon: Medal, color: "text-amber-700", bg: "bg-amber-700/10" },
];

export default function RankingSection({
  animeList,
  coins,
}: RankingSectionProps) {
  const ranked = [...animeList]
    .map((anime) => ({
      ...anime,
      totalCoins:
        coins.find((c) => c.annict_id === anime.id)?.total_coin_value || 0,
    }))
    .sort((a, b) => b.totalCoins - a.totalCoins)
    .slice(0, 3);

  if (ranked.length === 0 || ranked[0].totalCoins === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3 px-0.5">
        <Trophy className="h-4 w-4 text-coin" />
        <h3 className="font-semibold text-sm">コインランキング</h3>
      </div>
      <div className="flex gap-2.5 overflow-x-auto scroll-snap-x hide-scrollbar pb-1 -mx-1 px-1">
        {ranked.map((anime, i) => {
          const rank = rankConfig[i];
          const RankIcon = rank.icon;
          return (
            <div
              key={anime.id}
              className={cn(
                "shrink-0 scroll-snap-start rounded-xl border border-border bg-card p-3 w-[220px] sm:w-[240px]",
                i === 0 && "border-coin/20 bg-coin-muted",
              )}
            >
              <div className="flex items-start gap-2.5">
                <div
                  className={cn(
                    "h-7 w-7 rounded-full flex items-center justify-center shrink-0",
                    rank.bg,
                  )}
                >
                  <RankIcon className={cn("h-3.5 w-3.5", rank.color)} />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-sm line-clamp-1 mb-1">
                    {anime.title}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1 text-coin font-medium">
                      <Coins className="h-3 w-3" />
                      {anime.totalCoins.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {anime.watchersCount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
