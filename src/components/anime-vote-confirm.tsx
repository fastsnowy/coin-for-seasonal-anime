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
import { atomBetCoinValue } from "@/global/atom";
import { createVoteAction } from "@/lib/vote-create-action";
import { useAtomValue } from "jotai";
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

export function VoteConfirm({ seasonName }: { seasonName: string }) {
  const betCoinValue = useAtomValue(atomBetCoinValue);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);
  const router = useRouter();
  const totalCoins = betCoinValue.reduce(
    (acc, item) => acc + item.coin_value,
    0,
  );

  const handleSubmit = async () => {
    if (isSubmitting || isSubmittingRef.current) return;

    setIsSubmitting(true);
    isSubmittingRef.current = true;

    try {
      const result = await createVote(betCoinValue, seasonName);

      if (result) {
        const { resultId, deleteId } = result;

        const myVotes = JSON.parse(localStorage.getItem("myVotes") || "{}");
        myVotes[resultId] = {
          deleteId,
          timestamp: new Date().toISOString(),
        };
        localStorage.setItem("myVotes", JSON.stringify(myVotes));

        import("canvas-confetti").then(({ default: confetti }) => {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.85 },
            colors: [
              "#FFD700",
              "#FFC107",
              "#FFECB3",
              "#FFFFFF",
              "#FFF8E1",
            ],
          });
        });

        router.push(`/results?id=${resultId}`);
      } else {
        setIsSubmitting(false);
        isSubmittingRef.current = false;
      }
    } catch (error) {
      console.error("投票エラー:", error);
      setIsSubmitting(false);
      isSubmittingRef.current = false;
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="lg"
          className="h-10 px-5 gap-1.5 font-semibold active:scale-[0.97] transition-all"
          disabled={betCoinValue.length === 0}
        >
          投票確定
          <ChevronRight className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-2xl">
        <SheetHeader className="text-center">
          <div className="mx-auto w-10 h-1 bg-muted-foreground/20 rounded-full mb-3" />
          <SheetTitle className="text-lg">投票内容の確認</SheetTitle>
          <SheetDescription>以下の内容で投票します</SheetDescription>
        </SheetHeader>

        <div className="mt-4 space-y-2 max-h-[50vh] overflow-y-auto px-1">
          {betCoinValue.length > 0 ? (
            <>
              {betCoinValue.map((item) => (
                <div
                  key={item.annict_id}
                  className="flex justify-between items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/50"
                >
                  <span className="text-sm flex-1 line-clamp-2 leading-snug">
                    {item.title}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Coins className="w-3.5 h-3.5 text-coin" />
                    <span className="font-semibold text-sm tabular-nums text-coin">
                      {item.coin_value}
                    </span>
                  </div>
                </div>
              ))}

              <div className="flex justify-between items-center p-3 rounded-lg bg-coin-muted border border-coin/15 mt-3">
                <span className="font-semibold text-sm">合計</span>
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-coin" />
                  <span className="font-bold text-xl text-coin tabular-nums">
                    {totalCoins}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              現在、投票内容はありません。
            </p>
          )}
        </div>

        <SheetFooter className="mt-5 gap-2 sm:gap-2">
          <SheetClose asChild>
            <Button variant="outline" disabled={isSubmitting} className="flex-1">
              キャンセル
            </Button>
          </SheetClose>
          <Button
            onClick={handleSubmit}
            disabled={betCoinValue.length === 0 || isSubmitting}
            className="flex-1 gap-1.5"
          >
            {isSubmitting ? (
              "送信中..."
            ) : (
              <>
                <Coins className="w-4 h-4" />
                投票する
              </>
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
