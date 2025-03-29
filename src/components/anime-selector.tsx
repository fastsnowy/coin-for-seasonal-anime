"use client";
import { atomBetCoinValue, atomResetBetCoins } from "@/global/atom";
import { atomBetAnimeWorkId } from "@/global/atom";
import { useAtomValue } from "jotai";
import { useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { Button } from "./ui/button";

export function AnimeSelector() {
  const currentStatus = useAtomValue(atomBetCoinValue);
  const resetBetAnimeWorkId = useResetAtom(atomBetAnimeWorkId);
  const resetAllBetCoins = useSetAtom(atomResetBetCoins);

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
        <div className="text-lg font-medium">
          合計: <span className="font-bold text-primary">{totalCoinValue}</span>{" "}
          コイン
        </div>
        <div className="flex space-x-4">
          <Button size="lg">投票する</Button>
          <Button size="lg" variant="destructive" onClick={resetHandler}>
            リセット
          </Button>
        </div>
      </div>
    </div>
  );
}

const CheckModal = () => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-background p-4 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">投票を確定しますか？</h2>
        <div className="flex justify-end space-x-4">
          <Button>キャンセル</Button>
          <Button variant="destructive">確定</Button>
        </div>
      </div>
    </div>
  );
};
