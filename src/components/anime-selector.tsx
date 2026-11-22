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
import { NumberRoll } from "./ui/number-roll";

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
  const [frozenCount, setFrozenCount] = useState(0);

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
  const displayCount = isSubmitting ? frozenCount : selectCount;

  if (selectCount === 0 && !confirmOpen) return null;

  return (
    <section
      aria-label="投票内容"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] animate-slide-up-bar"
    >
      <div className="pointer-events-auto mx-auto flex max-w-xl items-center gap-2 rounded-2xl border border-border bg-card/85 p-2 shadow-xl backdrop-blur-2xl supports-[backdrop-filter]:bg-card/75">
        <Button
          size="icon-md"
          variant="ghost"
          onClick={resetHandler}
          disabled={isSubmitting}
          aria-label="選択中の投票内容をリセット"
          title="リセット"
          className="rounded-xl text-muted-foreground hover:text-foreground"
        >
          <RotateCcw aria-hidden="true" />
        </Button>

        <div className="flex min-w-0 items-center gap-2.5 pl-1">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-coin-muted ring-1 ring-coin/20">
            <Coins className="size-4 text-coin" aria-hidden="true" />
          </span>
          <div className="flex min-w-0 flex-col leading-tight">
            <span className="flex items-baseline gap-1 text-coin-foreground">
              <NumberRoll
                value={totalCoinValue}
                className="text-lg font-semibold tracking-tight"
              />
              <span className="text-xs font-medium">コイン</span>
            </span>
            <span className="truncate text-[11px] text-muted-foreground">
              <NumberRoll value={displayCount} duration={400} />
              作品を選択中
            </span>
          </div>
        </div>

        <div className="ml-auto shrink-0">
          <VoteConfirm
            seasonName={seasonName}
            onOpenChange={setConfirmOpen}
            onSubmittingChange={(submitting) => {
              if (submitting) {
                setFrozenTotal(liveTotal);
                setFrozenCount(selectCount);
              }
              setIsSubmitting(submitting);
            }}
          />
        </div>
      </div>
    </section>
  );
}
