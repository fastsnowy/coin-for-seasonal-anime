"use client";

import type { Anime } from "@/lib/anime-data";
import { useState, useMemo } from "react";

import { AnimeCard } from "./anime-card";
import { AnimeSelector } from "./anime-selector";
import { AnimeFilter, type MediaType, type SortType } from "./anime-filter";

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

  // フィルタリングとソート
  const filteredAndSortedAnimeList = useMemo(() => {
    let filtered = animeList;

    // メディアタイプでフィルタリング
    if (mediaType !== "all") {
      filtered = filtered.filter((anime) => anime.media === mediaType);
    }

    // ソート
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "coins": {
          const aCoins =
            coins.find((c) => c.annict_id === a.id)?.total_coin_value || 0;
          const bCoins =
            coins.find((c) => c.annict_id === b.id)?.total_coin_value || 0;
          return bCoins - aCoins;
        }
        case "watchers":
          return b.watchersCount - a.watchersCount;
        case "title":
          return a.title.localeCompare(b.title, "ja");
        default:
          return 0;
      }
    });

    return sorted;
  }, [animeList, coins, mediaType, sortBy]);

  const activeFilterCount = (mediaType !== "all" ? 1 : 0) + (sortBy !== "coins" ? 1 : 0);

  return (
    <>
      {/* フィルター */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-muted-foreground">
          {filteredAndSortedAnimeList.length}件のアニメ
        </div>
        <AnimeFilter
          mediaType={mediaType}
          sortBy={sortBy}
          onMediaTypeChange={setMediaType}
          onSortChange={setSortBy}
          activeFilterCount={activeFilterCount}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-32">
        {filteredAndSortedAnimeList.length > 0 ? (
          filteredAndSortedAnimeList.map((anime) => (
            <AnimeCard work={anime} key={anime.id} coins={coins} />
          ))
        ) : (
          <div className="col-span-full text-center py-20">
            <p className="text-muted-foreground text-lg">
              条件に一致するアニメが見つかりません
            </p>
          </div>
        )}
      </div>

      {/* 固定フッター - 選択数と投票ボタン */}
      {animeList.length > 0 && <AnimeSelector />}
    </>
  );
}
