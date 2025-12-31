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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-24">
      {animeList.map((anime) => (
        <AnimeCard
          work={anime}
          key={anime.id}
          coins={coins}
          isVoted={true}
          votedCoins={votedCoins}
        />
      ))}
    </div>
  );
}
