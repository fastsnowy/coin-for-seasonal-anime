import { useAtom } from "jotai";
import { memo } from "react";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { atomFamilyBetCoin } from "@/global/atom";
import type { Anime } from "@/lib/anime-data";

type workProps = {
  work: Anime;
};

type animeCardProps = {
  work: Anime;
  coins: {
    annict_id: number | null;
    total_coin_value: number | null;
  }[];
};

const SliderCoin = ({ work }: workProps) => {
  const [betValue, setBetValue] = useAtom(atomFamilyBetCoin(work.id));

  const handleIncrement = () => {
    setBetValue((prev) => Math.min(prev + 10, 100));
  };

  const handleDecrement = () => {
    setBetValue((prev) => Math.max(prev - 10, 0));
  };

  return (
    <div className="flex justify-center items-center space-x-2">
      <Button variant="outline" size="icon" onClick={handleDecrement}>
        -
      </Button>
      <Input
        type="number"
        value={betValue}
        onChange={(e) => {
          const val = Number.parseInt(e.target.value);
          if (!isNaN(val)) {
            setBetValue(Math.min(Math.max(val, 0), 100));
          }
        }}
        className="w-24 text-center"
      />
      <Button variant="outline" size="icon" onClick={handleIncrement}>
        +
      </Button>
    </div>
  );
};
const MemoSliderCoin = memo(SliderCoin);

export function AnimeCard({ work, coins }: animeCardProps) {
  const coinValue =
    coins.find((coin) => coin.annict_id === work.id)?.total_coin_value || 0;

  return (
    <Card key={work.id} className="p-0">
      <div className="rounded-t-xl">
        <a
          href={work.officialSiteUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-t-xl">
            <img
              src={work.image}
              alt={work.title}
              className="object-cover w-full h-full"
            />
          </AspectRatio>
        </a>
      </div>
      <CardContent className="p-2">
        <div className="flex justify-between items-center text-center">
          <div className="flex items-center space-x-2">
            <Badge variant="outline">{work.media}</Badge>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    onClick={() =>
                      window.open(
                        `https://twitter.com/${work.twitterUrl}`,
                        "_blank",
                      )
                    }
                  >
                    Tw{/* <FaTwitter /> */}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Twitter</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    onClick={() =>
                      window.open(
                        `https://annict.com/works/${work.id}`,
                        "_blank",
                      )
                    }
                  ></Button>
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
                <p className="text-sm">
                  {work.watchersCount.toLocaleString()} watchers
                </p>
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
                <p className="text-sm">{coinValue.toLocaleString()} coins</p>
              </TooltipTrigger>
              <TooltipContent>
                <p>コイン総数</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CardTitle className="text-center font-medium">{work.title}</CardTitle>
      </CardContent>
      <CardFooter className="p-2 justify-center">
        <MemoSliderCoin work={work} />
      </CardFooter>
    </Card>
  );
}
