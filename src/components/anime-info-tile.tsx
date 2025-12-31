"use client";

import type { Anime } from "@/lib/anime-data";
import { Eye } from "lucide-react";

type AnimeInfoTileProps = {
  anime: Anime;
  totalCoins: number;
};

export function AnimeInfoTile({ anime, totalCoins }: AnimeInfoTileProps) {
  return (
    <div className="flex-1 min-w-0 group relative flex items-center h-[92px] overflow-hidden rounded-xl border border-border/50 hover:border-primary/30 transition-all duration-300">
      {/* Background OGP Image with Simple Overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
        style={{
          backgroundImage: `url(${anime.image})`,
        }}
      />
      <div className="absolute inset-0 z-10 bg-black/60" />

      {/* Tile Content */}
      <div className="relative z-20 w-full h-full flex flex-col justify-between p-3 md:p-4 text-white text-shadow-sm">
        {/* Top Row: Watchers (Left) & Total Coins (Right) */}
        <div className="flex items-center justify-between text-[10px] md:text-xs">
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {anime.watchersCount.toLocaleString()} watchers
          </div>
          <div className="flex items-center gap-1 text-amber-400">
            <span className="font-bold">{totalCoins.toLocaleString()}</span>
            <span className="text-white/90">coins</span>
          </div>
        </div>

        {/* Bottom Row: Title & Media */}
        <div className="flex items-center gap-2">
          <span className="bg-white/20 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-medium text-white/90 border border-white/10 uppercase">
            {anime.media}
          </span>
          <h3 className="font-bold text-sm md:text-base leading-tight line-clamp-1">
            {anime.title}
          </h3>
        </div>
      </div>
    </div>
  );
}
