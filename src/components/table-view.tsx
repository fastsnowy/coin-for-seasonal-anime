"use client";

import { AnimeInfoTile } from "./anime-info-tile";
import { VotedCoinCount } from "./voted-coin-count";
import type { Anime } from "@/lib/anime-data";

type TableViewProps = {
  animeList: Anime[];
  coins: {
    annict_id: number | null;
    total_coin_value: number | null;
    uu: number | null;
  }[];
  votedCoins: {
    annict_id: number | null;
    coin_value: number | null;
  }[];
};

export function TableView({ animeList, coins, votedCoins }: TableViewProps) {
  return (
    <div className="w-full space-y-2 mb-24">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 p-2 text-sm font-medium text-muted-foreground border-b border-border/50">
        <div className="flex-1">作品名</div>
        <div className="w-[80px] text-right shrink-0">コイン数</div>
      </div>

      {/* Rows */}
      {animeList.map((anime) => {
        const coinValue =
          coins.find((c) => c.annict_id === anime.id)?.total_coin_value || 0;
        const votedCoinValue =
          votedCoins?.find((c) => c.annict_id === anime.id)?.coin_value || 0;

        return (
          <div key={anime.id} className="flex items-center gap-4 w-full">
            <AnimeInfoTile anime={anime} totalCoins={coinValue} />
            <VotedCoinCount votedCoins={votedCoinValue} />
          </div>
        );
      })}
    </div>
  );
}
