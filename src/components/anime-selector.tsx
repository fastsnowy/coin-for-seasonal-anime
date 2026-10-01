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
import { useState } from "react";
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
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [frozenTotal, setFrozenTotal] = useState(0);

  const resetHandler = () => {
    resetAllBetCoins();
    resetBetAnimeWorkId();
    toast.success("選択中の内容を初期化しました");
  };

  const selectCount = currentStatus.length;
  const liveTotal = currentStatus.reduce(
    (acc, item) => acc + (item.coin_value || 0),
    0,
  );
  const totalCoinValue = isSubmitting ? frozenTotal : liveTotal;

  if (selectCount === 0 && !confirmOpen) return null;

  return (
    <div className="fixed right-0 bottom-0 left-0 z-50 animate-slide-up-bar">
      <div className="border-t border-border bg-card pb-safe">
        <div className="container mx-auto max-w-5xl px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              size="icon"
              variant="ghost"
              onClick={resetHandler}
              disabled={isSubmitting}
              aria-label="投票内容をリセット"
              className="h-9 w-9 shrink-0 rounded-lg text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
            </Button>

            <div className="flex items-center gap-2 rounded-md bg-coin-muted px-3 py-1.5">
              <Coins className="h-4 w-4 shrink-0 text-coin" aria-hidden="true" />
              <span
                key={totalCoinValue}
                className="animate-coin-bounce text-lg font-bold text-coin tabular-nums"
              >
                {totalCoinValue}
              </span>
            </div>

            <div className="ml-auto">
              <VoteConfirm
                seasonName={seasonName}
                onOpenChange={setConfirmOpen}
                onSubmittingChange={(submitting) => {
                  if (submitting) setFrozenTotal(liveTotal);
                  setIsSubmitting(submitting);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
