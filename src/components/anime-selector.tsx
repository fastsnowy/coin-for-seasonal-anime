"use client";
import { atomBetCoinValue, atomResetBetCoins } from "@/global/atom";
import { atomBetAnimeWorkId } from "@/global/atom";
import { useAtomValue } from "jotai";
import { useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { Button } from "./ui/button";
import { Icon } from "@iconify/react";
import { DialogDemo } from "./anime-vote-comfirm";

export function AnimeSelector() {
  const currentStatus = useAtomValue(atomBetCoinValue);
  const resetBetAnimeWorkId = useResetAtom(atomBetAnimeWorkId);
  const resetAllBetCoins = useSetAtom(atomResetBetCoins);
  console.log("currentStatus", currentStatus);
  const resetHandler = () => {
    resetAllBetCoins(); // Reset the bet coins
    resetBetAnimeWorkId(); // Reset the selected works
  };

  const selectCount = currentStatus.length;
  const totalCoinValue = currentStatus.reduce(
    (acc, item) => acc + (item.total_coin_value || 0),
    0,
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 shadow-lg z-10">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-lg font-medium">
          選択中: <span className="font-bold text-primary">{selectCount}</span>{" "}
          作品
        </div>
        <div className="flex items-center space-x-1">
          <Icon icon="twemoji:coin" className="w-5 h-5" />
          <span className="font-bold text-primary">{totalCoinValue}</span>
        </div>
        <div className="flex space-x-4">
          <DialogDemo />
          <Button size="lg" variant="destructive" onClick={resetHandler}>
            リセット
          </Button>
        </div>
      </div>
    </div>
  );
}
