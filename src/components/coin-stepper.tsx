"use client";

import { NumberInput } from "@/components/number-input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { atomBetAnimeWork, atomSetBetAmount } from "@/global/atom";
import { useAtomValue, useSetAtom } from "jotai";
import { memo, useState } from "react";

export function CoinStepper({
  workId,
  title,
  confirmOnZero = false,
  disabled = false,
}: {
  workId: number;
  title: string;
  confirmOnZero?: boolean;
  disabled?: boolean;
}) {
  const betWork = useAtomValue(atomBetAnimeWork(workId));
  const setBetAmount = useSetAtom(atomSetBetAmount);
  const [pendingRemove, setPendingRemove] = useState(false);

  const apply = (amount: number) => {
    setBetAmount({ id: workId, title, amount });
  };

  return (
    <>
      <NumberInput
        min={0}
        max={100}
        stepper={10}
        value={betWork.amount}
        disabled={disabled}
        onValueChange={(value) => {
          if (value === undefined) return;
          if (confirmOnZero && value === 0 && betWork.amount > 0) {
            setPendingRemove(true);
            return;
          }
          apply(value);
        }}
      />
      <Dialog open={pendingRemove} onOpenChange={setPendingRemove}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>この作品を外しますか？</DialogTitle>
            <DialogDescription className="pt-2 leading-relaxed">
              コインを0にすると「{title}」が投票内容から削除されます。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setPendingRemove(false)}
            >
              キャンセル
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                apply(0);
                setPendingRemove(false);
              }}
            >
              外す
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export const MemoCoinStepper = memo(CoinStepper);
