"use client";
import { memo } from "react";

import { CoinStepper } from "@/components/coin-stepper";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import type { Anime } from "@/lib/anime-data";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { Coins, Eye } from "lucide-react";
import Link from "next/link";

type AnimeCardProps = {
  work: Anime;
  coins: {
    annict_id: number | null;
    total_coin_value: number | null;
    uu: number | null;
  }[];
  isVoted?: boolean;
  votedCoins?: {
    annict_id: number | null;
    coin_value: number | null;
  }[];
};

const MemoCoinStepper = memo(function MemoCoinStepper({
  work,
}: {
  work: Anime;
}) {
  return <CoinStepper workId={work.id} title={work.title} />;
});

export function AnimeCard({
  work,
  coins,
  isVoted,
  votedCoins,
}: AnimeCardProps) {
  const coinValue =
    coins.find((c) => c.annict_id === work.id)?.total_coin_value || 0;
  const votedCoinValue =
    votedCoins?.find((c) => c.annict_id === work.id)?.coin_value || 0;
  const hasVote = isVoted && votedCoinValue > 0;

  return (
    <div
      className={cn(
        "group overflow-hidden rounded-xl duration-300",
        "border border-border bg-card",
        "transition-[border-color,box-shadow]",
        hasVote
          ? "border-coin/25 shadow-[0_0_20px_-5px] shadow-coin/10"
          : "hover:border-border/80 hover:shadow-lg hover:shadow-black/10",
      )}
    >
      <a
        href={work.officialSiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block"
      >
        <AspectRatio ratio={16 / 9} className="overflow-hidden bg-muted">
          <img
            src={work.image}
            alt={work.title}
            width={320}
            height={180}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </AspectRatio>
        {coinValue > 0 && (
          <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-xs backdrop-blur-sm">
            <Coins className="h-3 w-3 text-coin" aria-hidden="true" />
            <span className="font-semibold text-white tabular-nums">
              {coinValue.toLocaleString()}
            </span>
          </div>
        )}
      </a>

      <div className="space-y-2 p-3">
        <h3 className="line-clamp-2 min-h-[2.5em] text-sm leading-snug font-semibold">
          {work.title}
        </h3>

        <div className="flex items-center gap-1.5">
          <Badge
            variant="secondary"
            className="h-[18px] px-1.5 py-0 text-[10px] font-medium"
          >
            {work.media}
          </Badge>
          {work.twitterUrl && (
            <Link
              href={`https://twitter.com/${work.twitterUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${work.title}のX`}
              className="inline-flex h-6 w-6 items-center justify-center rounded-md transition-colors hover:bg-muted"
            >
              <Icon icon="fa6-brands:x-twitter" className="h-3 w-3" />
            </Link>
          )}
          <Link
            href={`https://annict.com/works/${work.id}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${work.title}のAnnictページ`}
            className="inline-flex h-6 w-6 items-center justify-center rounded-md transition-colors hover:bg-muted"
          >
            <Icon icon="uil:letter-english-a" className="h-3.5 w-3.5" />
          </Link>
          <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
            <Eye className="h-3 w-3" aria-hidden="true" />
            <span className="tabular-nums">
              {work.watchersCount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-border/50 px-3 pt-1 pb-3">
        {isVoted ? (
          <div
            className={cn(
              "flex items-center justify-center gap-2 rounded-lg py-2.5",
              hasVote ? "bg-coin-muted" : "bg-muted/50",
            )}
          >
            <Coins
              className={cn(
                "h-4 w-4",
                hasVote ? "text-coin" : "text-muted-foreground",
              )}
              aria-hidden="true"
            />
            <span
              className={cn(
                "text-base font-bold tabular-nums",
                hasVote ? "text-coin" : "text-muted-foreground",
              )}
            >
              {votedCoinValue}
            </span>
          </div>
        ) : (
          <MemoCoinStepper work={work} />
        )}
      </div>
    </div>
  );
}
