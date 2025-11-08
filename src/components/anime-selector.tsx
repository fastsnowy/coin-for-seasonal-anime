"use client";
import {
  atomBetCoinValue,
  atomResetBetCoins,
  atomSelectSeason,
  atomSelectYear,
} from "@/global/atom";
import { atomBetAnimeWorkId } from "@/global/atom";
import { Icon } from "@iconify/react";
import { useAtomValue } from "jotai";
import { useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { toast } from "sonner";
import { VoteConfirm } from "./anime-vote-comfirm";
import { Button } from "./ui/button";

export function AnimeSelector() {
  const currentStatus = useAtomValue(atomBetCoinValue);
  const resetBetAnimeWorkId = useResetAtom(atomBetAnimeWorkId);
  const resetAllBetCoins = useSetAtom(atomResetBetCoins);
  const currentSeasonName = () => {
    const year = useAtomValue(atomSelectYear);
    const season = useAtomValue(atomSelectSeason);
    return `${year}-${season}`;
  };
  const seasonName = currentSeasonName();
  const resetHandler = () => {
    resetAllBetCoins(); // Reset the bet coins
    resetBetAnimeWorkId(); // Reset the selected works
    toast.success("選択中の内容を初期化しました");
  };

  const selectCount = currentStatus.length;
  const totalCoinValue = currentStatus.reduce(
    (acc, item) => acc + (item.coin_value || 0),
    0,
  );
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-border/50 shadow-2xl z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* 選択数表示 */}
          <div className="hidden md:flex items-center gap-3">
            <div className="text-sm text-muted-foreground">選択中</div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 rounded-full">
              <span className="font-bold text-primary text-lg">
                {selectCount}
              </span>
              <span className="text-xs text-muted-foreground">作品</span>
            </div>
          </div>

          {/* 中央：コイン総数とアクション */}
          <div className="flex items-center gap-4 mx-auto md:mx-0">
            {/* リセットボタン */}
            <Button
              size="lg"
              variant="outline"
              onClick={resetHandler}
              className="h-12 w-12 p-0 hover:bg-yellow-50 hover:border-yellow-300 dark:hover:bg-yellow-950/20"
            >
              <Icon
                icon="ri:reset-right-fill"
                className="w-5 h-5 text-yellow-600"
              />
            </Button>

            {/* コイン総数 */}
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 rounded-full border border-amber-200/50 dark:border-amber-800/30">
              <Icon icon="twemoji:coin" className="w-6 h-6" />
              <span className="font-bold text-amber-700 dark:text-amber-400 text-xl">
                {totalCoinValue}
              </span>
            </div>

            {/* 投票確定ボタン */}
            <VoteConfirm seasonName={seasonName} />
          </div>

          {/* スペーサー（レイアウトバランス用） */}
          <div className="hidden md:block w-[120px]" />
        </div>
      </div>
    </div>
  );
}
