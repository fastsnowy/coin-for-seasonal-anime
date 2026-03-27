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
      <div className="flex justify-end gap-1 pb-3 border-b border-border/50">
        {(["grid", "table"] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => setViewMode(mode)}
            className={cn(
              "h-8 w-8 rounded-md flex items-center justify-center transition-colors",
              viewMode === mode
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted",
            )}
          >
            {mode === "grid" ? (
              <LayoutGrid className="h-3.5 w-3.5" />
            ) : (
              <List className="h-3.5 w-3.5" />
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
