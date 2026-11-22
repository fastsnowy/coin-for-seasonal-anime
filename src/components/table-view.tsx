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
    <div>
      <div
        aria-hidden="true"
        className="mb-2 flex items-center justify-between gap-3 border-b border-border px-1 pb-2 text-[11px] font-medium tracking-wide text-muted-foreground"
      >
        <span className="flex-1">作品</span>
        <span className="w-[72px] shrink-0 text-right">投票コイン</span>
      </div>

      <ul className="stagger-children space-y-2">
        {animeList.map((anime) => {
          const totalCoins =
            coins.find((c) => c.annict_id === anime.id)?.total_coin_value || 0;
          const votedCoinValue =
            votedCoins?.find((c) => c.annict_id === anime.id)?.coin_value || 0;

          return (
            <li key={anime.id} className="flex items-center gap-3">
              <AnimeInfoTile anime={anime} totalCoins={totalCoins} />
              <VotedCoinCount votedCoins={votedCoinValue} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
