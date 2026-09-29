"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CoinStepper } from "@/components/coin-stepper";
import {
  atomBetAnimeWorkId,
  atomBetCoinValue,
  atomResetBetCoins,
} from "@/global/atom";
import { createVoteAction } from "@/lib/vote-create-action";
import { useAtomValue, useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { ChevronRight, Coins } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

type BetAnimes = {
  annict_id: number;
  title: string;
  coin_value: number;
}[];

const createVote = async (
  betCoinValue: BetAnimes,
  seasonName: string,
): Promise<{ resultId: string; deleteId: string } | null> => {
  try {
    return await createVoteAction({
      seasonName,
      betAnimes: betCoinValue.map((item) => ({
        annict_id: item.annict_id,
        coin_value: item.coin_value,
      })),
    });
  } catch (error) {
    console.error("Failed to create vote:", error);
    toast.error("エラーが発生しました");
    return null;
  }
};

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function VoteConfirm({
  seasonName,
  onOpenChange,
  onSubmittingChange,
}: {
  seasonName: string;
  onOpenChange?: (open: boolean) => void;
  onSubmittingChange?: (submitting: boolean) => void;
}) {
  const betCoinValue = useAtomValue(atomBetCoinValue);
  const resetAllBetCoins = useSetAtom(atomResetBetCoins);
  const resetBetAnimeWorkId = useResetAtom(atomBetAnimeWorkId);
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);
  const submittedItemsRef = useRef<BetAnimes>([]);
  const router = useRouter();
  const displayItems = isSubmitting ? submittedItemsRef.current : betCoinValue;
  const totalCoins = displayItems.reduce(
    (acc, item) => acc + item.coin_value,
    0,
  );

  const handleSubmit = async () => {
    if (isSubmitting || isSubmittingRef.current || betCoinValue.length === 0) {
      return;
    }

    submittedItemsRef.current = betCoinValue;
    setIsSubmitting(true);
    isSubmittingRef.current = true;
    onSubmittingChange?.(true);

    try {
      const result = await createVote(submittedItemsRef.current, seasonName);

      if (result) {
        const { resultId } = result;

        if (!prefersReducedMotion()) {
          import("canvas-confetti").then(({ default: confetti }) => {
            confetti({
              particleCount: 120,
              spread: 80,
              origin: { y: 0.85 },
              colors: ["#FFD700", "#FFC107", "#FFECB3", "#FFFFFF", "#FFF8E1"],
            });
          });
        }

        resetAllBetCoins();
        resetBetAnimeWorkId();
        router.push(`/results?id=${resultId}`);
      } else {
        submittedItemsRef.current = [];
        setIsSubmitting(false);
        isSubmittingRef.current = false;
        onSubmittingChange?.(false);
      }
    } catch (error) {
      console.error("投票エラー:", error);
      submittedItemsRef.current = [];
      setIsSubmitting(false);
      isSubmittingRef.current = false;
      onSubmittingChange?.(false);
    }
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        if (isSubmitting) return;
        setOpen(next);
        onOpenChange?.(next);
      }}
    >
      <SheetTrigger asChild>
        <Button
          size="lg"
          className="h-10 gap-1.5 px-5 font-semibold transition-transform active:scale-[0.97]"
          disabled={betCoinValue.length === 0}
        >
          投票確定
          <ChevronRight className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="rounded-t-2xl"
        aria-busy={isSubmitting}
        onPointerDownOutside={(event) => {
          if (isSubmitting) event.preventDefault();
        }}
        onEscapeKeyDown={(event) => {
          if (isSubmitting) event.preventDefault();
        }}
      >
        <SheetHeader className="text-center">
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-muted-foreground/20" />
          <SheetTitle className="text-lg">投票内容の確認</SheetTitle>
          <SheetDescription>
            コイン数を調整してから投票できます
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 max-h-[50vh] space-y-2 overflow-y-auto overscroll-contain px-1">
          {displayItems.length > 0 ? (
            <>
              {displayItems.map((item) => (
                <div
                  key={item.annict_id}
                  className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/50 p-3"
                >
                  <span className="min-w-0 flex-1 line-clamp-2 text-sm leading-snug">
                    {item.title}
                  </span>
                  <div className="w-36 shrink-0">
                    <CoinStepper
                      workId={item.annict_id}
                      title={item.title}
                      confirmOnZero
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              ))}

              <div className="mt-3 flex items-center justify-between rounded-lg border border-coin/15 bg-coin-muted p-3">
                <span className="text-sm font-semibold">合計</span>
                <div className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-coin" aria-hidden="true" />
                  <span className="text-xl font-bold text-coin tabular-nums">
                    {totalCoins}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <p className="py-8 text-center text-muted-foreground">
              現在、投票内容はありません。
            </p>
          )}
        </div>

        <SheetFooter className="mt-5 gap-2 sm:gap-2">
          <SheetClose asChild>
            <Button
              variant="outline"
              disabled={isSubmitting}
              className="flex-1"
            >
              キャンセル
            </Button>
          </SheetClose>
          <Button
            onClick={handleSubmit}
            disabled={displayItems.length === 0 || isSubmitting}
            className="flex-1 gap-1.5"
            aria-busy={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span
                  className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
                  aria-hidden="true"
                />
                送信中…
              </>
            ) : (
              <>
                <Coins className="h-4 w-4" />
                投票する
              </>
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
