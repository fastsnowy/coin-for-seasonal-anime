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
import { useAtomValue } from "jotai";
import { atomBetCoinValue } from "@/global/atom";

export function DialogDemo() {
  const betCoinValue = useAtomValue(atomBetCoinValue);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" size="lg">
          投票内容を確認
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>投票内容の確認</DialogTitle>
          <DialogDescription>以下は現在の投票内容です。</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {betCoinValue.length > 0 ? (
            betCoinValue.map((item) => (
              <div
                key={item.annict_id}
                className="flex justify-between items-center"
              >
                <span>{`${item.title}`}</span>
                <span>{`${item.total_coin_value} コイン`}</span>
              </div>
            ))
          ) : (
            <p>現在、投票内容はありません。</p>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              閉じる
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
