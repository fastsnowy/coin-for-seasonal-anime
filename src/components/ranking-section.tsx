import type { Anime } from "@/lib/anime-data";
import { cn } from "@/lib/utils";
import { Coins, Eye } from "lucide-react";

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

  return (
    <section className="mb-8" aria-labelledby="coin-ranking-heading">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h3
          id="coin-ranking-heading"
          className="text-sm font-semibold tracking-wide"
        >
          コインランキング
        </h3>
        <span className="text-[10px] font-medium tracking-[0.18em] text-muted-foreground">
          TOP {ranked.length}
        </span>
      </div>
      <ol className="grid border-y border-border sm:grid-cols-3">
        {ranked.map((anime, i) => (
          <li
            key={anime.id}
            className={cn(
              "flex min-w-0 items-start gap-4 py-4 sm:py-5",
              i > 0 &&
                "border-t border-border sm:border-t-0 sm:border-l sm:pl-5",
              i < ranked.length - 1 && "sm:pr-5",
            )}
          >
            <span
              aria-label={`${i + 1}位`}
              className={cn(
                "shrink-0 text-4xl font-medium leading-none tracking-tighter tabular-nums",
                i === 0 ? "text-coin" : "text-muted-foreground",
              )}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0 flex-1">
              <h4
                className="mb-2 line-clamp-2 text-sm font-semibold leading-snug"
                title={anime.title}
              >
                {anime.title}
              </h4>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1 font-semibold text-foreground tabular-nums">
                  <Coins className="h-3 w-3 text-coin" aria-hidden="true" />
                  <span className="sr-only">コイン数 </span>
                  {anime.totalCoins.toLocaleString()}
                </span>
                <span className="flex items-center gap-1 tabular-nums">
                  <Eye className="h-3 w-3" aria-hidden="true" />
                  <span className="sr-only">視聴者数 </span>
                  {anime.watchersCount.toLocaleString()}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
