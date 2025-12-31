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
import {
  atomBetCoinValue,
  atomSelectSeason,
  atomSelectYear,
} from "@/global/atom";
import { supabase } from "@/lib/supabaseClient";
import { Icon } from "@iconify/react";
import { useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
const currentSeasonName = () => {
  const year = useAtomValue(atomSelectYear);
  const season = useAtomValue(atomSelectSeason);
  return `${year}-${season}`;
};

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
  if (betanimes.length === 0) {
    throw new Error("No anime to vote"); // エラーをスロー
  }
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

  if (!validationResult.success) {
    throw new Error("Failed to create vote data"); // エラーをスロー
  }

  const { error } = await supabase.from("dev_coins").insert(insertData);

  if (error) {
    throw new Error("Failed to insert vote data"); // エラーをスロー
  }

  return { resultId, deleteId }; // 成功時のみ値を返す
};

const createVoteAndGetUrl = async (
  betCoinValue: BetAnimes,
  seasonName: string,
): Promise<string | null> => {
  try {
    const { resultId, deleteId } = await createVoteHandler(
      betCoinValue,
      seasonName,
    );
    console.log("Vote created successfully:", resultId);
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
    if (isSubmitting || isSubmittingRef.current) return; // 既に送信中の場合は何もしない

    setIsSubmitting(true); // すぐにdisabledにする
    isSubmittingRef.current = true;

    try {
      const redirectUrl = await createVoteAndGetUrl(betCoinValue, seasonName);
      console.log("投票内容", betCoinValue);
      console.log("投票内容を送信しました");

      if (redirectUrl) {
        // URLから投票IDを抽出
        const urlParams = new URLSearchParams(redirectUrl.split("?")[1]);
        const voteId = urlParams.get("id");
        const deleteId = urlParams.get("did");

        // localStorageに投票情報を保存（投票者のみ削除可能にする）
        if (voteId && deleteId) {
          const myVotes = JSON.parse(localStorage.getItem("myVotes") || "{}");
          myVotes[voteId] = {
            deleteId,
            timestamp: new Date().toISOString(),
          };
          localStorage.setItem("myVotes", JSON.stringify(myVotes));
        }

        router.push(redirectUrl); // クライアント側でページ遷移
      } else {
        setIsSubmitting(false); // エラー時は再度有効にする
        isSubmittingRef.current = false;
      }
    } catch (error) {
      console.error("投票エラー:", error);
      setIsSubmitting(false); // エラー時は再度有効にする
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

              {/* 合計 */}
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
