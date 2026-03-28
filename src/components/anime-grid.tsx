"use client";

import type { Anime } from "@/lib/anime-data";
import { useMemo, useState } from "react";

import { AnimeCard } from "./anime-card";
import { AnimeFilter, type MediaType, type SortType } from "./anime-filter";
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
  const [mediaType, setMediaType] = useState<MediaType>("all");
  const [sortBy, setSortBy] = useState<SortType>("coins");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const filteredAndSortedAnimeList = useMemo(() => {
    let filtered = animeList;
    if (mediaType !== "all") {
      filtered = filtered.filter((anime) => anime.media === mediaType);
    }

    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "coins": {
          const aCoins =
            coins.find((c) => c.annict_id === a.id)?.total_coin_value || 0;
          const bCoins =
            coins.find((c) => c.annict_id === b.id)?.total_coin_value || 0;
          comparison = bCoins - aCoins;
          break;
        }
        case "watchers":
          comparison = b.watchersCount - a.watchersCount;
          break;
        case "title":
          comparison = a.title.localeCompare(b.title, "ja");
          break;
      }
      return sortOrder === "desc" ? comparison : -comparison;
    });

    return sorted;
  }, [animeList, coins, mediaType, sortBy, sortOrder]);

  const activeFilterCount =
    (mediaType !== "all" ? 1 : 0) +
    (sortBy !== "coins" ? 1 : 0) +
    (sortOrder !== "desc" ? 1 : 0);

  return (
    <>
      <div className="flex items-center justify-between mb-4 gap-3">
        <p className="text-xs text-muted-foreground tabular-nums">
          {filteredAndSortedAnimeList.length} 作品
        </p>
        <AnimeFilter
          mediaType={mediaType}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onMediaTypeChange={setMediaType}
          onSortChange={setSortBy}
          onSortOrderChange={setSortOrder}
          activeFilterCount={activeFilterCount}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-28">
        {filteredAndSortedAnimeList.length > 0 ? (
          filteredAndSortedAnimeList.map((anime) => (
            <AnimeCard work={anime} key={anime.id} coins={coins} />
          ))
        ) : (
          <div className="col-span-full text-center py-16">
            <p className="text-muted-foreground">
              条件に一致するアニメがありません
            </p>
          </div>
        )}
      </div>

      {animeList.length > 0 && <AnimeSelector />}
    </>
  );
}
