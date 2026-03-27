"use client";
import {
  atomBetCoinValue,
  atomResetBetCoins,
  atomSelectSeason,
  atomSelectYear,
} from "@/global/atom";
import { atomBetAnimeWorkId } from "@/global/atom";
import { useAtomValue, useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { Coins, RotateCcw } from "lucide-react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { VoteConfirm } from "./anime-vote-comfirm";

export function AnimeSelector() {
  const currentStatus = useAtomValue(atomBetCoinValue);
  const resetBetAnimeWorkId = useResetAtom(atomBetAnimeWorkId);
  const resetAllBetCoins = useSetAtom(atomResetBetCoins);
  const year = useAtomValue(atomSelectYear);
  const season = useAtomValue(atomSelectSeason);
  const seasonName = `${year}-${season}`;

  const selectCount = currentStatus.length;
  const totalCoinValue = currentStatus.reduce(
    (acc, item) => acc + (item.coin_value || 0),
    0,
  );

  const coinRef = useRef<HTMLSpanElement>(null);
  const prevTotalRef = useRef(totalCoinValue);

  useEffect(() => {
    if (totalCoinValue !== prevTotalRef.current && totalCoinValue > 0 && coinRef.current) {
      coinRef.current.classList.remove("animate-coin-bounce");
      void coinRef.current.offsetWidth;
      coinRef.current.classList.add("animate-coin-bounce");
    }
    prevTotalRef.current = totalCoinValue;
  }, [totalCoinValue]);

  const resetHandler = () => {
    resetAllBetCoins();
    resetBetAnimeWorkId();
    toast.success("選択をリセットしました");
  };

  if (selectCount === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up-bar">
      <div className="bg-card/80 backdrop-blur-2xl border-t border-border shadow-[0_-8px_32px_-8px_rgba(0,0,0,0.4)] pb-safe">
        <div className="container mx-auto max-w-4xl px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Count */}
            <div className="flex items-center gap-1.5 shrink-0 text-sm text-muted-foreground">
              <span className="inline-flex items-center justify-center h-6 min-w-6 px-1.5 rounded-md bg-primary text-primary-foreground text-xs font-bold tabular-nums">
                {selectCount}
              </span>
              <span className="hidden sm:inline">作品</span>
            </div>

            {/* Coin total */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-coin-muted border border-coin/15 mx-auto sm:mx-0">
              <Coins className="w-4 h-4 shrink-0 text-coin" />
              <span
                ref={coinRef}
                className="font-bold text-coin text-lg tabular-nums"
              >
                {totalCoinValue}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0 ml-auto">
              <button
                type="button"
                onClick={resetHandler}
                className="h-10 w-10 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <VoteConfirm seasonName={seasonName} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
