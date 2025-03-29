"use client";

import type { Anime } from "@/lib/anime-data";

import { AnimeCard } from "./anime-card";
import { AnimeSelector } from "./anime-selector";

interface AnimeGridProps {
  animeList: Anime[];
  coins: {
    annict_id: number | null;
    total_coin_value: number | null;
    uu: number | null;
  }[];
}

export default function AnimeGrid({ animeList, coins }: AnimeGridProps) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-24">
        {animeList.length > 0 ? (
          animeList.map((anime) => (
            <AnimeCard work={anime} key={anime.id} coins={coins} />
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-muted-foreground">
              選択した期間のアニメが見つかりません
            </p>
          </div>
        )}
      </div>

      {/* 固定フッター - 選択数と投票ボタン */}
      {animeList.length > 0 && <AnimeSelector />}
    </>
  );
}
