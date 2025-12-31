"use client";
import { useAtom } from "jotai";
import { memo } from "react";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { atomBetAnimeWork, atomBetAnimeWorkId } from "@/global/atom";
import type { Anime } from "@/lib/anime-data";
import { Icon } from "@iconify/react";
import { Coins, Eye } from "lucide-react";
import Link from "next/link";
import { NumberInput } from "./number-input";

type workProps = {
  work: Anime;
};

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

const SliderCoin = ({ work }: workProps) => {
  const [betWorkId, setBetWorkId] = useAtom(atomBetAnimeWorkId);
  const [betWork, setBetWork] = useAtom(atomBetAnimeWork(work.id));
  return (
    <div className="flex justify-center items-center space-x-2 w-full">
      <NumberInput
        min={0}
        max={100}
        stepper={10}
        defaultValue={0}
        value={betWork.amount}
        onValueChange={(value) => {
          if (value !== undefined) {
            setBetWork((prev) => {
              return {
                ...prev,
                work_id: work.id,
                title: work.title,
                amount: value,
              };
            });
          }
          setBetWorkId((prev) => {
            if (!prev.includes(work.id)) {
              return [...prev, work.id];
            }
            return prev;
          });
        }}
      />
    </div>
  );
};
const MemoSliderCoin = memo(SliderCoin);

export function AnimeCard({
  work,
  coins,
  isVoted,
  votedCoins,
}: animeCardProps) {
  const coinValue =
    coins.find((coin) => coin.annict_id === work.id)?.total_coin_value || 0;
  const votersCount = coins.find((coin) => coin.annict_id === work.id)?.uu || 0;
  const votedCoinValue =
    votedCoins?.find((coin) => coin.annict_id === work.id)?.coin_value || 0;

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/30">
      {/* アニメ画像 */}
      <a
        href={work.officialSiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <AspectRatio ratio={16 / 9} className="overflow-hidden bg-muted">
          <img
            src={work.image}
            alt={work.title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        </AspectRatio>
      </a>

      <CardContent className="p-3 space-y-2">
        {/* タイトル */}
        <h3 className="font-semibold text-sm leading-tight line-clamp-2 min-h-[2.5rem]">
          {work.title}
        </h3>
        {/* リンク */}
        <div className="flex items-center gap-1.5">
          <Badge variant="secondary" className="text-xs px-2 py-0.5 h-5">
            {work.media}
          </Badge>
          <Link
            href={`https://twitter.com/${work.twitterUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center h-6 w-6 rounded hover:bg-muted transition-colors"
          >
            <Icon icon="fa6-brands:x-twitter" className="h-3.5 w-3.5" />
          </Link>
          <Link
            href={`https://annict.com/works/${work.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center h-6 w-6 rounded hover:bg-muted transition-colors"
          >
            <Icon icon="uil:letter-english-a" className="h-4 w-4" />
          </Link>
        </div>

        {/* 統計情報 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-500">
            <Coins className="h-4 w-4 flex-shrink-0" />
            <span className="font-medium text-sm">
              {coinValue.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-500">
            <Eye className="h-4 w-4 flex-shrink-0" />
            <span className="font-medium text-sm">
              {work.watchersCount.toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-3 pt-0">
        {isVoted ? (
          <div className="flex items-center justify-center gap-2 w-full py-2 px-3 bg-muted rounded-lg">
            <Icon icon="twemoji:coin" className="h-5 w-5" />
            <span className="font-semibold text-base">{votedCoinValue}</span>
          </div>
        ) : (
          <MemoSliderCoin work={work} />
        )}
      </CardFooter>
    </Card>
  );
}
