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
    <div className="space-y-2 pb-20">
      <div className="flex items-center justify-between gap-4 px-1 py-1.5 text-xs font-medium text-muted-foreground border-b border-border/50">
        <span className="flex-1">作品名</span>
        <span className="w-[72px] text-right shrink-0">コイン</span>
      </div>

      {animeList.map((anime) => {
        const totalCoins =
          coins.find((c) => c.annict_id === anime.id)?.total_coin_value || 0;
        const votedCoinValue =
          votedCoins?.find((c) => c.annict_id === anime.id)?.coin_value || 0;

        return (
          <div key={anime.id} className="flex items-center gap-3">
            <AnimeInfoTile anime={anime} totalCoins={totalCoins} />
            <VotedCoinCount votedCoins={votedCoinValue} />
          </div>
        );
      })}
    </div>
  );
}
