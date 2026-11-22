"use client";

import { AnimeCard } from "@/components/anime-card";
import type { Anime } from "@/lib/anime-data";

type GridViewProps = {
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

export function GridView({ animeList, coins, votedCoins }: GridViewProps) {
  return (
    <ul className="stagger-children grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {animeList.map((anime) => (
        <li key={anime.id}>
          <AnimeCard
            work={anime}
            coins={coins}
            isVoted={true}
            votedCoins={votedCoins}
          />
        </li>
      ))}
    </ul>
  );
}
