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
import { NumberRoll } from "@/components/ui/number-roll";
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
  // Snapshot shown while submitting, so the list doesn't empty out when the
  // draft is reset right before navigation.
  const [submittedItems, setSubmittedItems] = useState<BetAnimes>([]);
  const router = useRouter();
  const displayItems = isSubmitting ? submittedItems : betCoinValue;
  const totalCoins = displayItems.reduce(
    (acc, item) => acc + item.coin_value,
    0,
  );

  const handleSubmit = async () => {
    if (isSubmitting || isSubmittingRef.current || betCoinValue.length === 0) {
      return;
    }

    const items = betCoinValue;
    setSubmittedItems(items);
    setIsSubmitting(true);
    isSubmittingRef.current = true;
    onSubmittingChange?.(true);

    try {
      const result = await createVote(items, seasonName);

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
        setSubmittedItems([]);
        setIsSubmitting(false);
        isSubmittingRef.current = false;
        onSubmittingChange?.(false);
      }
    } catch (error) {
      console.error("投票エラー:", error);
      setSubmittedItems([]);
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
          size="md"
          className="rounded-xl px-4 font-semibold"
          disabled={betCoinValue.length === 0}
          iconRight={<ChevronRight aria-hidden="true" />}
        >
          確認する
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="mx-auto max-h-[90dvh] w-full max-w-xl gap-0 rounded-t-2xl pb-safe sm:border-x"
        aria-busy={isSubmitting}
        onPointerDownOutside={(event) => {
          if (isSubmitting) event.preventDefault();
        }}
        onEscapeKeyDown={(event) => {
          if (isSubmitting) event.preventDefault();
        }}
      >
        <div
          aria-hidden="true"
          className="mx-auto mt-2.5 h-1 w-10 rounded-full bg-muted-foreground/20"
        />
        <SheetHeader className="pb-2">
          <SheetTitle className="text-lg">投票内容の確認</SheetTitle>
          <SheetDescription>
            コイン数を調整してから投票できます
          </SheetDescription>
        </SheetHeader>

        {displayItems.length > 0 ? (
          <>
            <ul className="stagger-children min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain px-4 py-1">
              {displayItems.map((item) => (
                <li
                  key={item.annict_id}
                  className="flex items-center gap-3 rounded-xl border border-border bg-surface-sunken/60 py-2.5 pr-2.5 pl-3.5"
                >
                  <span className="line-clamp-2 min-w-0 flex-1 text-sm leading-snug font-medium">
                    {item.title}
                  </span>
                  <div className="w-36 shrink-0">
                    <CoinStepper
                      workId={item.annict_id}
                      title={item.title}
                      confirmOnZero
                      disabled={isSubmitting}
                      size="sm"
                      showMeter={false}
                    />
                  </div>
                </li>
              ))}
            </ul>

            <div className="mx-4 mt-3 flex items-center justify-between rounded-xl border border-coin/20 bg-coin-muted px-4 py-3">
              <span className="text-sm font-medium">
                合計
                <span className="ml-1.5 text-xs text-muted-foreground">
                  {displayItems.length}作品
                </span>
              </span>
              <span className="flex items-center gap-2 text-coin-foreground">
                <Coins className="size-5 text-coin" aria-hidden="true" />
                <NumberRoll
                  value={totalCoins}
                  className="text-xl font-semibold tracking-tight"
                />
                <span className="sr-only">コイン</span>
              </span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
            <span className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Coins className="size-5" aria-hidden="true" />
            </span>
            <p className="text-sm text-muted-foreground">
              選択中の作品はありません
            </p>
          </div>
        )}

        <SheetFooter className="flex-row gap-2 pt-4">
          <SheetClose asChild>
            <Button
              variant="outline"
              size="lg"
              disabled={isSubmitting}
              className="flex-1"
            >
              戻る
            </Button>
          </SheetClose>
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={displayItems.length === 0}
            loading={isSubmitting}
            icon={<Coins aria-hidden="true" />}
            className="flex-[1.4] font-semibold"
          >
            {isSubmitting ? "送信中…" : "投票する"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
