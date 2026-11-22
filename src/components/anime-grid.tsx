"use client";

import type { Anime } from "@/lib/anime-data";
import { RotateCcw, SearchX } from "lucide-react";
import { useMemo, useState } from "react";

import { AnimeCard } from "./anime-card";
import { AnimeFilter, type MediaType, type SortType } from "./anime-filter";
import { AnimeSelector } from "./anime-selector";
import { Button } from "./ui/button";
import { NumberRoll } from "./ui/number-roll";

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

  const resetFilters = () => {
    setMediaType("all");
    setSortBy("coins");
    setSortOrder("desc");
  };

  return (
    <section aria-labelledby="anime-list-heading">
      <div className="sticky top-14 z-30 -mx-4 mb-4 flex items-center justify-between gap-3 border-b border-transparent bg-background/80 px-4 py-2.5 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
        <h3
          id="anime-list-heading"
          className="flex items-baseline gap-1.5 text-sm font-semibold tracking-tight"
        >
          作品一覧
          <span className="text-xs font-normal text-muted-foreground">
            <NumberRoll value={filteredAndSortedAnimeList.length} duration={400} />
            <span className="ml-0.5">件</span>
          </span>
        </h3>
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

      {filteredAndSortedAnimeList.length > 0 ? (
        <ul className="stagger-children grid grid-cols-1 gap-4 pb-[calc(8rem+env(safe-area-inset-bottom,0px))] sm:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedAnimeList.map((anime) => (
            <li key={anime.id}>
              <AnimeCard work={anime} coins={coins} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex animate-fade-up flex-col items-center gap-3 rounded-2xl border border-dashed border-border-strong px-6 py-16 text-center">
          <span className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <SearchX className="size-5" aria-hidden="true" />
          </span>
          <div className="space-y-1">
            <p className="text-sm font-medium">
              {animeList.length === 0
                ? "このシーズンの作品はまだありません"
                : "条件に一致する作品がありません"}
            </p>
            <p className="text-xs text-muted-foreground">
              {animeList.length === 0
                ? "情報が公開されるまでしばらくお待ちください"
                : "絞り込み条件を変えてみてください"}
            </p>
          </div>
          {animeList.length > 0 && activeFilterCount > 0 && (
            <Button
              variant="outline"
              size="md"
              onClick={resetFilters}
              icon={<RotateCcw aria-hidden="true" />}
            >
              条件をリセット
            </Button>
          )}
        </div>
      )}

      {animeList.length > 0 && <AnimeSelector />}
    </section>
  );
}
