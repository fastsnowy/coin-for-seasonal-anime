"use client";
import {
  atomBetAnimeWorkId,
  atomSelectWorkCount,
  atomTotalCoinValue,
} from "@/global/atom";
import { useAtomValue } from "jotai";
import { Button } from "./ui/button";

export function AnimeSelector() {
  const selectCount = useAtomValue(atomSelectWorkCount);
  const totalCoinValue = useAtomValue(atomTotalCoinValue);
  const betWorkId = useAtomValue(atomBetAnimeWorkId);

  console.log(selectCount);
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
          <Button size="lg" variant="destructive">
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
