"use client";
import { memo } from "react";

import { CoinStepper } from "@/components/coin-stepper";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { atomBetAnimeWork } from "@/global/atom";
import type { Anime } from "@/lib/anime-data";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { useAtomValue } from "jotai";
import { Coins, ExternalLink, Eye } from "lucide-react";
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

const iconLink = cn(
  "relative inline-flex size-8 items-center justify-center rounded-md text-muted-foreground outline-none",
  "transition-[color,background-color,scale] duration-150 ease-out-quint hover:bg-accent hover:text-foreground",
  "active:scale-95 motion-reduce:active:scale-100 focus-visible:ring-[3px] focus-visible:ring-ring/35",
  // 40px+ hit area
  "after:absolute after:-inset-1 after:content-['']",
);

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
  const draftAmount = useAtomValue(atomBetAnimeWork(work.id)).amount;
  const isSelected = !isVoted && draftAmount > 0;
  const highlighted = hasVote || isSelected;

  return (
    <article
      data-selected={highlighted || undefined}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-xs",
        "transition-[translate,border-color,box-shadow] duration-300 ease-out-quint",
        "hover:-translate-y-0.5 hover:shadow-md motion-reduce:hover:translate-y-0",
        highlighted
          ? "border-coin/40 shadow-[0_0_0_1px_var(--coin-muted),var(--elevation-sm)]"
          : "border-border hover:border-border-strong",
      )}
    >
      <a
        href={work.officialSiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${work.title}の公式サイトを開く`}
        className="relative block outline-none focus-visible:ring-[3px] focus-visible:ring-ring/35 focus-visible:ring-inset"
      >
        <AspectRatio ratio={16 / 9} className="overflow-hidden bg-surface-sunken">
          <img
            src={work.image}
            alt=""
            width={320}
            height={180}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-[scale] duration-700 ease-out-quint group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-black/0 opacity-70 transition-opacity duration-300 group-hover:opacity-100"
          />
        </AspectRatio>


        <span
          aria-hidden="true"
          className="absolute bottom-2 left-2 flex size-7 items-center justify-center rounded-full bg-black/45 text-white opacity-0 ring-1 ring-white/10 backdrop-blur-md transition-opacity duration-200 group-hover:opacity-100"
        >
          <ExternalLink className="size-3.5" />
        </span>
      </a>

      {coinValue > 0 && (
        <div className="pointer-events-none absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/55 px-2 py-0.5 text-xs text-white shadow-sm ring-1 ring-white/10 backdrop-blur-md">
          <Coins className="size-3 text-coin" aria-hidden="true" />
          <span className="sr-only">合計</span>
          <span className="font-semibold tabular-nums">
            {coinValue.toLocaleString()}
          </span>
          <span className="sr-only">コイン</span>
        </div>
      )}

      <div className="flex flex-1 flex-col gap-2 px-3.5 pt-3 pb-2.5">
        <h3 className="line-clamp-2 min-h-[2.75em] text-sm leading-snug font-semibold tracking-tight">
          {work.title}
        </h3>

        <div className="-ml-1.5 flex items-center gap-0.5">
          <Badge variant="neutral" className="mr-1 ml-1.5 h-5 px-1.5 text-[10px]">
            {work.media}
          </Badge>
          {work.twitterUrl && (
            <Link
              href={`https://twitter.com/${work.twitterUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${work.title}のX（旧Twitter）`}
              className={iconLink}
            >
              <Icon icon="fa6-brands:x-twitter" className="size-3.5" aria-hidden="true" />
            </Link>
          )}
          <Link
            href={`https://annict.com/works/${work.id}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${work.title}のAnnictページ`}
            className={iconLink}
          >
            <Icon icon="uil:letter-english-a" className="size-4" aria-hidden="true" />
          </Link>
          <div
            className="ml-auto flex items-center gap-1 text-xs text-muted-foreground"
            title="Annictの視聴者数"
          >
            <Eye className="size-3.5" aria-hidden="true" />
            <span className="sr-only">視聴者数</span>
            <span className="tabular-nums">
              {work.watchersCount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "border-t px-3 py-3 transition-colors duration-300",
          highlighted ? "border-coin/20 bg-coin-muted/60" : "border-border/70 bg-surface-sunken/40",
        )}
      >
        {isVoted ? (
          <div className="flex h-9 items-center justify-center gap-2">
            <Coins
              className={cn(
                "size-4",
                hasVote ? "text-coin" : "text-muted-foreground/60",
              )}
              aria-hidden="true"
            />
            <span
              className={cn(
                "text-base font-semibold tabular-nums",
                hasVote ? "text-coin-foreground" : "text-muted-foreground",
              )}
            >
              {votedCoinValue}
            </span>
            <span className="sr-only">コインを投票</span>
          </div>
        ) : (
          <MemoCoinStepper work={work} />
        )}
      </div>
    </article>
  );
}
