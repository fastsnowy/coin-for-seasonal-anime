"use client";

import { useState } from "react";
import { LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { GridView } from "./grid-view";
import { TableView } from "./table-view";
import type { Anime } from "@/lib/anime-data";

type ResultsClientProps = {
  animeList: Anime[];
  coins: {
    annict_id: number | null;
    total_coin_value: number | null;
    uu: number | null;
  }[];
  id: string;
  votedCoins: {
    annict_id: number | null;
    coin_value: number | null;
  }[];
};

export function ResultsClient({
  animeList,
  coins,
  id,
  votedCoins,
}: ResultsClientProps) {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  return (
    <div className="space-y-4">
      <div
        className="flex justify-end gap-1 border-b border-border/50 pb-3"
        role="group"
        aria-label="表示形式"
      >
        {(["grid", "table"] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => setViewMode(mode)}
            aria-label={mode === "grid" ? "グリッド表示" : "一覧表示"}
            aria-pressed={viewMode === mode}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
              viewMode === mode
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {mode === "grid" ? (
              <LayoutGrid className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <List className="h-3.5 w-3.5" aria-hidden="true" />
            )}
          </button>
        ))}
      </div>

      {viewMode === "grid" ? (
        <GridView animeList={animeList} coins={coins} votedCoins={votedCoins} />
      ) : (
        <TableView animeList={animeList} coins={coins} votedCoins={votedCoins} />
      )}
    </div>
  );
}
