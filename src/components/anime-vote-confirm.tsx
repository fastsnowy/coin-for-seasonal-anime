"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { atomBetCoinValue } from "@/global/atom";
import { createVoteAction } from "@/lib/vote-create-action";
import { Icon } from "@iconify/react";
import { useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

type BetAnimes = {
  annict_id: number;
  title: string;
  coin_value: number;
}[];

const createVoteAndGetUrl = async (
  betCoinValue: BetAnimes,
  seasonName: string,
): Promise<string | null> => {
  try {
    const { resultId, deleteId } = await createVoteAction({
      seasonName,
      betAnimes: betCoinValue.map((item) => ({
        annict_id: item.annict_id,
        coin_value: item.coin_value,
      })),
    });
    return `/results?id=${resultId}&did=${deleteId}`;
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
      const redirectUrl = await createVoteAndGetUrl(betCoinValue, seasonName);

      if (redirectUrl) {
        const urlParams = new URLSearchParams(redirectUrl.split("?")[1]);
        const voteId = urlParams.get("id");
        const deleteId = urlParams.get("did");

        if (voteId && deleteId) {
          const myVotes = JSON.parse(localStorage.getItem("myVotes") || "{}");
          myVotes[voteId] = {
            deleteId,
            timestamp: new Date().toISOString(),
          };
          localStorage.setItem("myVotes", JSON.stringify(myVotes));
        }

        router.push(redirectUrl);
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
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="default"
          size="lg"
          className="h-12 px-6 gap-2 shadow-lg hover:shadow-xl transition-all font-semibold"
          disabled={betCoinValue.length === 0}
        >
          <Icon icon="mdi:check-circle" className="w-5 h-5" />
          <span className="hidden sm:inline">投票確定</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">投票内容の確認</DialogTitle>
          <DialogDescription className="text-base">
            以下の内容で投票します。よろしいですか？
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4 max-h-96 overflow-y-auto">
          {betCoinValue.length > 0 ? (
            <>
              {betCoinValue.map((item) => (
                <div
                  key={item.annict_id}
                  className="flex justify-between items-start gap-4 p-3 rounded-lg bg-muted/50 border border-border/50"
                >
                  <span className="text-sm flex-1 line-clamp-2">
                    {item.title}
                  </span>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Icon icon="twemoji:coin" className="w-4 h-4" />
                    <span className="font-semibold text-sm">
                      {item.coin_value}
                    </span>
                  </div>
                </div>
              ))}

              <div className="flex justify-between items-center p-3 rounded-lg bg-primary/10 border border-primary/20">
                <span className="font-semibold">合計</span>
                <div className="flex items-center gap-2">
                  <Icon icon="twemoji:coin" className="w-5 h-5" />
                  <span className="font-bold text-lg text-primary">
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

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isSubmitting}>
              キャンセル
            </Button>
          </DialogClose>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={betCoinValue.length === 0 || isSubmitting}
          >
            {isSubmitting ? "送信中..." : "投票する"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
