"use client";
import { useAtom } from "jotai";
import { memo } from "react";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { atomBetAnimeWork, atomBetAnimeWorkId } from "@/global/atom";
import type { Anime } from "@/lib/anime-data";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { Coins, Eye } from "lucide-react";
import Link from "next/link";
import { NumberInput } from "./number-input";

type workProps = { work: Anime };
type animeCardProps = {
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

const CoinStepper = ({ work }: workProps) => {
  const [, setBetWorkId] = useAtom(atomBetAnimeWorkId);
  const [betWork, setBetWork] = useAtom(atomBetAnimeWork(work.id));
  return (
    <NumberInput
      min={0}
      max={100}
      stepper={10}
      defaultValue={0}
      value={betWork.amount}
      onValueChange={(value) => {
        if (value !== undefined) {
          setBetWork((prev) => ({
            ...prev,
            work_id: work.id,
            title: work.title,
            amount: value,
          }));
        }
        setBetWorkId((prev) => {
          if (!prev.includes(work.id)) return [...prev, work.id];
          return prev;
        });
      }}
    />
  );
};
const MemoCoinStepper = memo(CoinStepper);

export function AnimeCard({
  work,
  coins,
  isVoted,
  votedCoins,
}: animeCardProps) {
  const coinValue =
    coins.find((c) => c.annict_id === work.id)?.total_coin_value || 0;
  const votedCoinValue =
    votedCoins?.find((c) => c.annict_id === work.id)?.coin_value || 0;
  const hasVote = isVoted && votedCoinValue > 0;

  return (
    <div
      className={cn(
        "group rounded-xl overflow-hidden transition-all duration-300",
        "bg-card border border-border",
        hasVote
          ? "border-coin/25 shadow-[0_0_20px_-5px] shadow-coin/10"
          : "hover:border-border/80 hover:shadow-lg hover:shadow-black/10",
      )}
    >
      <a
        href={work.officialSiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative"
      >
        <AspectRatio ratio={16 / 9} className="overflow-hidden bg-muted">
          <img
            src={work.image}
            alt={work.title}
            className="object-cover w-full h-full group-hover:scale-[1.03] transition-transform duration-500"
          />
        </AspectRatio>
        {coinValue > 0 && (
          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-xs">
            <Coins className="h-3 w-3 text-coin" />
            <span className="font-semibold text-white tabular-nums">
              {coinValue.toLocaleString()}
            </span>
          </div>
        )}
      </a>

      <div className="p-3 space-y-2">
        <h3 className="font-semibold text-sm leading-snug line-clamp-2 min-h-[2.5em]">
          {work.title}
        </h3>

        <div className="flex items-center gap-1.5">
          <Badge
            variant="secondary"
            className="text-[10px] px-1.5 py-0 h-[18px] font-medium"
          >
            {work.media}
          </Badge>
          {work.twitterUrl && (
            <Link
              href={`https://twitter.com/${work.twitterUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-6 w-6 rounded-md hover:bg-muted transition-colors"
            >
              <Icon icon="fa6-brands:x-twitter" className="h-3 w-3" />
            </Link>
          )}
          <Link
            href={`https://annict.com/works/${work.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center h-6 w-6 rounded-md hover:bg-muted transition-colors"
          >
            <Icon icon="uil:letter-english-a" className="h-3.5 w-3.5" />
          </Link>
          <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
            <Eye className="h-3 w-3" />
            <span className="tabular-nums">{work.watchersCount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="px-3 pb-3 pt-1 border-t border-border/50">
        {isVoted ? (
          <div
            className={cn(
              "flex items-center justify-center gap-2 py-2.5 rounded-lg",
              hasVote
                ? "bg-coin-muted"
                : "bg-muted/50",
            )}
          >
            <Coins className={cn("h-4 w-4", hasVote ? "text-coin" : "text-muted-foreground")} />
            <span
              className={cn(
                "font-bold text-base tabular-nums",
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
