"use client";
import { useAtom, useSetAtom } from "jotai";
import { memo } from "react";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { atomBetAnimeWorkId, atomFamilyBetCoin } from "@/global/atom";
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
};

const SliderCoin = ({ work }: workProps) => {
  const [betValue, setBetValue] = useAtom(atomFamilyBetCoin(work.id));
  const setBetWorkId = useSetAtom(atomBetAnimeWorkId);

  return (
    <div className="flex justify-center items-center space-x-2">
      <NumberInput
        min={0}
        max={100}
        stepper={10}
        defaultValue={0}
        value={betValue}
        onValueChange={(value) => {
          if (value !== undefined) {
            setBetValue(value);
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

export function AnimeCard({ work, coins }: animeCardProps) {
  const coinValue =
    coins.find((coin) => coin.annict_id === work.id)?.total_coin_value || 0;
  const votersCount = coins.find((coin) => coin.annict_id === work.id)?.uu || 0;

  return (
    <Card key={work.id} className="p-0">
      <div className="rounded-t-xl">
        <a
          href={work.officialSiteUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-t-xl">
            <img src={work.image} alt={work.title} className="object-cover" />
          </AspectRatio>
        </a>
      </div>
      <CardContent className="px-2">
        <div className="flex justify-between items-center text-center">
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                {/* Official */}
                <TooltipTrigger asChild>
                  <Badge variant="outline">{work.media}</Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>media</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {/* <Badge variant="outline">{work.media}</Badge> */}
            <TooltipProvider>
              <Tooltip>
                {/* Twitter */}
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="w-6 h-6 p-1">
                    <Link
                      href={`https://twitter.com/${work.twitterUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icon icon="fa6-brands:x-twitter" />
                    </Link>
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Twitter / X</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                {/* Annict */}
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="w-6 h-6 p-1">
                    <Link
                      href={`https://annict.com/works/${work.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icon icon="uil:letter-english-a" />
                    </Link>
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Annict</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center text-blue-600 text-sm">
                  <Eye className="h-4 w-4 mr-1" />
                  <span> {work.watchersCount.toLocaleString()} watchers</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>視聴者数</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex justify-end text-right">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center text-yellow-600 text-sm">
                  <Coins className="h-4 w-4 mr-1" />
                  <span>{coinValue.toLocaleString()} coins</span>
                </div>
                {/* <p className="text-sm">{coinValue.toLocaleString()} coins</p> */}
              </TooltipTrigger>
              <TooltipContent>
                <p>コイン総数</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex justify-end text-right">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center text-blue-600 text-sm">
                  <span>{votersCount.toLocaleString()} counts</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>投票回数</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="text-center text-md font-medium">{work.title}</div>
      </CardContent>
      <CardFooter className="py-2 justify-center">
        <MemoSliderCoin work={work} />
      </CardFooter>
    </Card>
  );
}
