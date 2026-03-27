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
import { DB_TABLES } from "@/config/database";
import { atomBetCoinValue } from "@/global/atom";
import { supabase } from "@/lib/supabaseClient";
import confetti from "canvas-confetti";
import { useAtomValue } from "jotai";
import { ChevronRight, Coins } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

type BetAnimes = {
  annict_id: number;
  title: string;
  coin_value: number;
}[];

const insertDataSchema = z.array(
  z.object({
    annict_id: z.number().int().positive(),
    coin_value: z.number().int().min(1).max(100),
    season: z.string().regex(/^\d{4}-(spring|summer|autumn|winter)$/),
    created_id: z.string().uuid(),
    delete_id: z.string().length(7),
  }),
);

const createVoteHandler = async (
  betanimes: BetAnimes,
  seasonName: string,
): Promise<{ resultId: string; deleteId: string }> => {
  if (betanimes.length === 0) throw new Error("No anime to vote");

  const resultId = uuidv4();
  const deleteId = Math.random().toString(36).slice(-7);
  const insertData = betanimes.map((item) => ({
    annict_id: item.annict_id,
    coin_value: item.coin_value,
    season: seasonName,
    created_id: resultId,
    delete_id: deleteId,
  }));

  const validationResult = insertDataSchema.safeParse(insertData);
  if (!validationResult.success) throw new Error("Failed to create vote data");

  const { error } = await supabase.from(DB_TABLES.COINS).insert(insertData);
  if (error) throw new Error("Failed to insert vote data");

  return { resultId, deleteId };
};

const fireConfetti = () => {
  const count = 180;
  const defaults = { startVelocity: 30, spread: 360, ticks: 80, zIndex: 200 };

  function fire(ratio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      particleCount: Math.floor(count * ratio),
      origin: { x: Math.random() * 0.4 + 0.3, y: Math.random() * 0.3 + 0.3 },
      colors: ["#fbbf24", "#f59e0b", "#d97706", "#ffffff", "#fef3c7"],
      ...opts,
    });
  }

  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  fire(0.1, { spread: 120, startVelocity: 45 });
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
      const { resultId, deleteId } = await createVoteHandler(
        betCoinValue,
        seasonName,
      );

      const myVotes = JSON.parse(localStorage.getItem("myVotes") || "{}");
      myVotes[resultId] = { deleteId, timestamp: new Date().toISOString() };
      localStorage.setItem("myVotes", JSON.stringify(myVotes));

      fireConfetti();
      setTimeout(() => {
        router.push(`/results?id=${resultId}&did=${deleteId}`);
      }, 900);
    } catch (error) {
      console.error("投票エラー:", error);
      toast.error("エラーが発生しました");
      setIsSubmitting(false);
      isSubmittingRef.current = false;
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="lg"
          disabled={betCoinValue.length === 0}
          className="h-10 px-5 gap-1.5 font-semibold rounded-lg active:scale-[0.97] transition-all"
        >
          投票確定
          <ChevronRight className="w-4 h-4" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="rounded-t-2xl max-h-[80dvh] flex flex-col"
      >
        <SheetHeader className="text-center pb-0">
          <div className="mx-auto w-10 h-1 bg-muted-foreground/20 rounded-full mb-3" />
          <SheetTitle className="text-lg">投票内容の確認</SheetTitle>
          <SheetDescription>以下の内容で投票します</SheetDescription>
        </SheetHeader>

        {/* Total */}
        <div className="flex items-center justify-center gap-3 py-5 mx-4 rounded-xl bg-coin-muted border border-coin/15">
          <Coins className="w-6 h-6 text-coin" />
          <span className="font-bold text-3xl text-coin tabular-nums">
            {totalCoins}
          </span>
          <span className="text-sm text-muted-foreground">コイン</span>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1.5 min-h-0">
          {betCoinValue.map((item) => (
            <div
              key={item.annict_id}
              className="flex justify-between items-center gap-3 px-3 py-2.5 rounded-lg bg-muted/40"
            >
              <span className="text-sm flex-1 line-clamp-1">{item.title}</span>
              <div className="flex items-center gap-1.5 shrink-0 text-coin">
                <Coins className="w-3.5 h-3.5" />
                <span className="font-semibold text-sm tabular-nums">
                  {item.coin_value}
                </span>
              </div>
            </div>
          ))}
        </div>

        <SheetFooter className="flex-row gap-3 pt-3 border-t border-border/50 pb-safe">
          <SheetClose asChild>
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              className="flex-1 h-12 rounded-xl"
            >
              キャンセル
            </Button>
          </SheetClose>
          <Button
            onClick={handleSubmit}
            disabled={betCoinValue.length === 0 || isSubmitting}
            className="flex-1 h-12 rounded-xl font-semibold active:scale-[0.98] transition-all"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                送信中...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Coins className="w-4 h-4" />
                投票する
              </span>
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
