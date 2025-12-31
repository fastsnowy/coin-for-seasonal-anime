"use client";

import { Icon } from "@iconify/react";

type VotedCoinCountProps = {
  votedCoins: number;
};

export function VotedCoinCount({ votedCoins }: VotedCoinCountProps) {
  return (
    <div className="flex-shrink-0 w-[80px] flex justify-end items-center gap-1.5 pr-1">
      <Icon icon="twemoji:coin" className="h-5 w-5" />
      <span className="font-bold text-lg text-foreground">{votedCoins}</span>
    </div>
  );
}
