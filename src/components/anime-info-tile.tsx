"use client";

import type { Anime } from "@/lib/anime-data";
import { cn } from "@/lib/utils";
import { Coins, Eye } from "lucide-react";

type AnimeInfoTileProps = {
  anime: Anime;
  totalCoins: number;
};

export function AnimeInfoTile({ anime, totalCoins }: AnimeInfoTileProps) {
  return (
    <div className="flex-1 min-w-0 group relative flex items-center h-20 overflow-hidden rounded-lg border border-border">
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
        style={{ backgroundImage: `url(${anime.image})` }}
      />
      <div className="absolute inset-0 bg-black/65" />

      <div className="relative w-full h-full flex flex-col justify-between p-3 text-white">
        <div className="flex items-center justify-between text-[10px]">
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {anime.watchersCount.toLocaleString()}
          </span>
          {totalCoins > 0 && (
            <span className="flex items-center gap-1 text-coin">
              <Coins className="h-3 w-3" />
              {totalCoins.toLocaleString()}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-white/15 backdrop-blur-sm px-1.5 py-0.5 rounded text-[9px] font-medium uppercase">
            {anime.media}
          </span>
          <h3 className="font-semibold text-xs leading-tight line-clamp-1">
            {anime.title}
          </h3>
        </div>
      </div>
    </div>
  );
}
