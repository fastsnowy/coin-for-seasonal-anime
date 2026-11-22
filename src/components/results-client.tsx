"use client";

import { useState } from "react";
import { LayoutGrid, List } from "lucide-react";
import { SegmentedControl } from "@/components/ui/segmented-control";
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

type ViewMode = "grid" | "table";

const viewOptions = [
  {
    value: "grid",
    label: <span className="hidden sm:inline">グリッド</span>,
    icon: <LayoutGrid aria-hidden="true" />,
    ariaLabel: "グリッド表示",
  },
  {
    value: "table",
    label: <span className="hidden sm:inline">リスト</span>,
    icon: <List aria-hidden="true" />,
    ariaLabel: "リスト表示",
  },
] as const;

export function ResultsClient({
  animeList,
  coins,
  votedCoins,
}: ResultsClientProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  return (
    <section aria-labelledby="voted-anime-heading" className="space-y-4">
      <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
        <h2
          id="voted-anime-heading"
          className="flex items-baseline gap-2 text-sm font-semibold"
        >
          賭けた作品
          <span className="text-xs font-medium text-muted-foreground tabular-nums">
            {animeList.length}作品
          </span>
        </h2>
        <SegmentedControl
          aria-label="表示形式"
          size="lg"
          options={viewOptions}
          value={viewMode}
          onValueChange={setViewMode}
        />
      </div>

      <div key={viewMode} className="animate-fade-up">
        {viewMode === "grid" ? (
          <GridView
            animeList={animeList}
            coins={coins}
            votedCoins={votedCoins}
          />
        ) : (
          <TableView
            animeList={animeList}
            coins={coins}
            votedCoins={votedCoins}
          />
        )}
      </div>
    </section>
  );
}
