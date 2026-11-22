"use client";

import type { Anime } from "@/lib/anime-data";
import { Coins, Eye } from "lucide-react";

type AnimeInfoTileProps = {
  anime: Anime;
  totalCoins: number;
};

export function AnimeInfoTile({ anime, totalCoins }: AnimeInfoTileProps) {
  return (
    <div className="group relative flex h-20 min-w-0 flex-1 items-center overflow-hidden rounded-xl border border-border bg-surface-sunken shadow-xs">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center transition-[scale] duration-700 ease-out-quint group-hover:scale-105 motion-reduce:group-hover:scale-100"
        style={{ backgroundImage: `url(${anime.image})` }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/35"
      />

      <div className="relative flex h-full w-full flex-col justify-between p-3 text-white">
        <div className="flex items-center justify-between text-[11px] text-white/80">
          <span className="flex items-center gap-1 tabular-nums">
            <Eye className="size-3" aria-hidden="true" />
            <span className="sr-only">視聴者数</span>
            {anime.watchersCount.toLocaleString()}
          </span>
          {totalCoins > 0 && (
            <span className="flex items-center gap-1 font-medium text-coin tabular-nums">
              <Coins className="size-3" aria-hidden="true" />
              <span className="sr-only">合計コイン</span>
              {totalCoins.toLocaleString()}
            </span>
          )}
        </div>

        <div className="flex min-w-0 items-center gap-2">
          <span className="shrink-0 rounded bg-white/15 px-1.5 py-0.5 text-[10px] font-medium uppercase ring-1 ring-white/10 backdrop-blur-sm">
            {anime.media}
          </span>
          <h3 className="line-clamp-1 text-sm leading-tight font-semibold">
            {anime.title}
          </h3>
        </div>
      </div>
    </div>
  );
}
