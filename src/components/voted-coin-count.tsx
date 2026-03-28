"use client";

import { Coins } from "lucide-react";

export function VotedCoinCount({ votedCoins }: { votedCoins: number }) {
  return (
    <div className="flex items-center justify-end gap-1.5 w-[72px] shrink-0">
      <Coins className="h-4 w-4 text-coin" />
      <span className="font-bold text-base tabular-nums text-coin">
        {votedCoins}
      </span>
    </div>
  );
}
