"use client";

import { Icon } from "@iconify/react";

export function VotedCoinCount({ votedCoins }: { votedCoins: number }) {
  return (
    <div className="flex items-center justify-end gap-1.5 w-[72px] shrink-0">
      <Icon icon="twemoji:coin" className="h-4 w-4" />
      <span className="font-bold text-base tabular-nums text-coin">
        {votedCoins}
      </span>
    </div>
  );
}
