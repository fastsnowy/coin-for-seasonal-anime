"use client";

import { useState } from "react";
import { LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <div className="space-y-6">
      <div className="flex justify-end gap-2 border-b border-border/50 pb-4">
        <Button
          variant={viewMode === "grid" ? "default" : "ghost"}
          size="icon"
          onClick={() => setViewMode("grid")}
          className="h-8 w-8"
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === "table" ? "default" : "ghost"}
          size="icon"
          onClick={() => setViewMode("table")}
          className="h-8 w-8"
        >
          <List className="h-4 w-4" />
        </Button>
      </div>

      {viewMode === "grid" ? (
        <GridView animeList={animeList} coins={coins} votedCoins={votedCoins} />
      ) : (
        <TableView
          animeList={animeList}
          coins={coins}
          votedCoins={votedCoins}
        />
      )}
    </div>
  );
}
