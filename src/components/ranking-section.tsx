import type { Anime } from "@/lib/anime-data";
import { cn } from "@/lib/utils";
import { Coins, Eye, Trophy } from "lucide-react";

interface RankingSectionProps {
  animeList: Anime[];
  coins: {
    annict_id: number | null;
    total_coin_value: number | null;
    uu: number | null;
  }[];
}

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

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3 px-0.5">
        <Trophy className="h-4 w-4 text-coin" />
        <h3 className="font-semibold text-sm">コインランキング</h3>
      </div>
      <div className="flex gap-2.5 overflow-x-auto scroll-snap-x hide-scrollbar pb-1 -mx-1 px-1">
        {ranked.map((anime, i) => (
          <div
            key={anime.id}
            className={cn(
              "shrink-0 scroll-snap-start rounded-xl border border-border bg-card p-3 w-[220px] sm:w-[240px]",
              i === 0 && "border-coin/20 bg-coin-muted",
            )}
          >
            <div className="flex items-start gap-2.5">
              <span className="text-lg leading-none">{medals[i]}</span>
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
        ))}
      </div>
    </div>
  );
}
