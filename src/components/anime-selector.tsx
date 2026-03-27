"use client";

import {
  atomBetCoinValue,
  atomResetBetCoins,
  atomSelectSeason,
  atomSelectYear,
} from "@/global/atom";
import { atomBetAnimeWorkId } from "@/global/atom";
import { useAtomValue } from "jotai";
import { useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { Coins, RotateCcw } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";
import { VoteConfirm } from "./anime-vote-confirm";
import { Button } from "./ui/button";

export function AnimeSelector() {
  const currentStatus = useAtomValue(atomBetCoinValue);
  const year = useAtomValue(atomSelectYear);
  const season = useAtomValue(atomSelectSeason);
  const resetBetAnimeWorkId = useResetAtom(atomBetAnimeWorkId);
  const resetAllBetCoins = useSetAtom(atomResetBetCoins);
  const seasonName = `${year}-${season}`;
  const prevTotalRef = useRef(0);

  const resetHandler = () => {
    resetAllBetCoins();
    resetBetAnimeWorkId();
    toast.success("選択中の内容を初期化しました");
  };

  const selectCount = currentStatus.length;
  const totalCoinValue = currentStatus.reduce(
    (acc, item) => acc + (item.coin_value || 0),
    0,
  );

  const totalChanged = totalCoinValue !== prevTotalRef.current;
  prevTotalRef.current = totalCoinValue;

  if (selectCount === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up-bar">
      <div className="bg-card/80 backdrop-blur-2xl border-t border-border/50 pb-safe">
        <div className="container mx-auto max-w-5xl px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              size="icon"
              variant="ghost"
              onClick={resetHandler}
              className="h-9 w-9 shrink-0 rounded-lg text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-coin-muted border border-coin/10">
              <Coins className="w-4 h-4 shrink-0 text-coin" />
              <span
                className={`font-bold text-lg text-coin tabular-nums ${totalChanged ? "animate-coin-bounce" : ""}`}
              >
                {totalCoinValue}
              </span>
            </div>

            <div className="ml-auto">
              <VoteConfirm seasonName={seasonName} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
