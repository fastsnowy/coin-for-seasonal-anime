import type { Anime } from "@/lib/anime-data";
import { cn } from "@/lib/utils";
import { Eye } from "lucide-react";
import { CoinTotal } from "@/components/ui/coin-total";

interface RankingSectionProps {
  animeList: Anime[];
  coins: {
    annict_id: number | null;
    total_coin_value: number | null;
    uu: number | null;
  }[];
}

const rankStyles = [
  // 1st: filled gold coin
  "bg-[radial-gradient(circle_at_30%_25%,oklch(0.93_0.11_92),var(--coin)_55%,oklch(0.58_0.14_75))] text-[oklch(0.3_0.06_75)] shadow-[inset_0_0_0_1px_oklch(0.45_0.1_75/35%),var(--elevation-xs)]",
  // 2nd / 3rd: quiet neutral medals
  "bg-surface-raised text-foreground ring-1 ring-border-strong shadow-xs",
  "bg-surface-raised text-muted-foreground ring-1 ring-border shadow-xs",
] as const;

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

  const max = ranked[0].totalCoins;

  return (
    <section className="mb-8" aria-labelledby="coin-ranking-heading">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2
          id="coin-ranking-heading"
          className="text-sm font-semibold tracking-tight"
        >
          コインランキング
        </h2>
        <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] font-semibold tracking-[0.14em] text-muted-foreground">
          TOP {ranked.length}
        </span>
      </div>
      <ol className="stagger-children overflow-hidden rounded-2xl surface divide-y divide-border">
        {ranked.map((anime, i) => {
          const pct = Math.max(4, Math.round((anime.totalCoins / max) * 100));
          return (
            <li
              key={anime.id}
              className={cn(
                "relative flex min-w-0 items-center gap-3 px-4 py-3.5 sm:gap-4 sm:px-5",
                i === 0 &&
                  "bg-[linear-gradient(90deg,var(--coin-muted),transparent_70%)]",
              )}
            >
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold tabular-nums",
                  rankStyles[i],
                )}
              >
                <span className="sr-only">第</span>
                {i + 1}
                <span className="sr-only">位</span>
              </span>

              {anime.image ? (
                // eslint-disable-next-line @next/next/no-img-element -- external Annict CDN, matches anime-card
                <img
                  src={anime.image}
                  alt=""
                  width={64}
                  height={36}
                  loading="lazy"
                  decoding="async"
                  className="hidden h-9 w-16 shrink-0 rounded-md bg-surface-sunken object-cover ring-1 ring-border sm:block"
                />
              ) : null}

              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-3">
                  <h3
                    className={cn(
                      "line-clamp-1 text-sm leading-snug",
                      i === 0 ? "font-semibold" : "font-medium",
                    )}
                    title={anime.title}
                  >
                    {anime.title}
                  </h3>
                  <span
                    className={cn(
                      "flex shrink-0 items-baseline gap-0.5 text-sm font-semibold",
                      i === 0 ? "text-coin-foreground" : "text-foreground",
                    )}
                  >
                    <span className="sr-only">コイン数 </span>
                    <CoinTotal value={anime.totalCoins} />
                    <span className="text-[11px] font-medium text-muted-foreground">
                      枚
                    </span>
                  </span>
                </div>

                <div className="mt-2 flex items-center gap-3">
                  {/* Share of the leader's total; grows in on first paint. */}
                  <div
                    aria-hidden="true"
                    className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted"
                  >
                    <div className="h-full" style={{ width: `${pct}%` }}>
                      <div
                        className={cn(
                          "h-full origin-left rounded-full [scale:1]",
                          "transition-[scale] duration-1000 ease-out-expo starting:[scale:0_1] motion-reduce:transition-none",
                          i === 0 ? "bg-coin" : "bg-foreground/25",
                        )}
                        style={{ transitionDelay: `${150 + i * 90}ms` }}
                      />
                    </div>
                  </div>
                  <span className="flex shrink-0 items-center gap-1 text-[11px] text-muted-foreground tabular-nums">
                    <Eye className="size-3" aria-hidden="true" />
                    <span className="sr-only">視聴者数 </span>
                    {anime.watchersCount.toLocaleString()}
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
