"use client";

import { cn } from "@/lib/utils";
import { Coins } from "lucide-react";

export function VotedCoinCount({ votedCoins }: { votedCoins: number }) {
  const active = votedCoins > 0;
  return (
    <div className="flex w-[72px] shrink-0 items-center justify-end gap-1.5">
      <Coins
        className={cn("size-4", active ? "text-coin" : "text-muted-foreground/50")}
        aria-hidden="true"
      />
      <span
        className={cn(
          "text-base font-semibold tabular-nums",
          active ? "text-coin-foreground" : "text-muted-foreground",
        )}
      >
        {votedCoins}
      </span>
      <span className="sr-only">コインを投票</span>
    </div>
  );
}
