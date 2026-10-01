import { AspectRatio } from "@/components/ui/aspect-ratio";
import { type Anime } from "@/lib/anime-data";
import { getSeasonName, type Season } from "@/lib/seasons";
import { Coins } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export const THUMBNAILS_PER_VOTE = 4;

export type VoteItem = {
  annictId: number;
  coinValue: number;
};

export type VoteGroup = {
  createdId: string;
  season: string;
  seasonLabel: string;
  createdAt: string;
  totalCoins: number;
  items: VoteItem[];
};

export function VoteGroupCard({
  group,
  animeById,
  actions,
}: {
  group: VoteGroup;
  animeById: Map<number, Anime>;
  actions?: ReactNode;
}) {
  const thumbnails = group.items.slice(0, THUMBNAILS_PER_VOTE);
  const restCount = group.items.length - thumbnails.length;

  return (
    <div className="rounded-lg border border-border bg-card p-4 transition-colors hover:border-coin/30">
      <div className="flex items-center justify-between gap-3">
        <Link
          href={`/results?id=${group.createdId}`}
          className="flex min-w-0 flex-1 items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {group.seasonLabel}
          </span>
          <span className="truncate text-xs text-muted-foreground">
            {formatVotedAt(group.createdAt)}
          </span>
        </Link>
        <div className="flex shrink-0 items-center gap-1.5">
          <Coins className="h-4 w-4 text-coin" />
          <span className="text-lg font-bold tabular-nums text-coin">
            {group.totalCoins}
          </span>
          {actions}
        </div>
      </div>

      <Link
        href={`/results?id=${group.createdId}`}
        className="mt-3 block hover:opacity-90 transition-opacity"
      >
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {thumbnails.map((item) => {
            const anime = animeById.get(item.annictId);
            return (
              <div key={item.annictId} className="space-y-1">
                <AspectRatio
                  ratio={16 / 9}
                  className="relative overflow-hidden rounded-lg bg-muted"
                >
                  {anime?.image ? (
                    <img
                      src={anime.image}
                      alt={anime.title}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                  <span className="absolute bottom-1 right-1 rounded-md bg-black/65 px-1.5 text-[10px] font-semibold tabular-nums text-white backdrop-blur-sm">
                    {item.coinValue}
                  </span>
                </AspectRatio>
                <p className="line-clamp-1 text-[11px] text-muted-foreground">
                  {anime?.title ?? `作品ID: ${item.annictId}`}
                </p>
              </div>
            );
          })}
        </div>

        {restCount > 0 && (
          <p className="mt-2 text-[11px] text-muted-foreground">
            ほか{restCount}作品
          </p>
        )}
      </Link>
    </div>
  );
}

export function groupVotes(
  votes: {
    created_id: string;
    season: string;
    coin_value: number;
    annict_id: number | null;
    created_at: string;
  }[],
): VoteGroup[] {
  const grouped = new Map<string, VoteGroup>();

  for (const vote of votes) {
    let group = grouped.get(vote.created_id);
    if (!group) {
      group = {
        createdId: vote.created_id,
        season: vote.season,
        seasonLabel: formatSeasonLabel(vote.season),
        createdAt: vote.created_at,
        totalCoins: 0,
        items: [],
      };
      grouped.set(vote.created_id, group);
    }
    group.totalCoins += vote.coin_value;
    if (vote.annict_id !== null) {
      group.items.push({
        annictId: vote.annict_id,
        coinValue: vote.coin_value,
      });
    }
  }

  for (const group of grouped.values()) {
    group.items.sort((a, b) => b.coinValue - a.coinValue);
  }

  return Array.from(grouped.values());
}

export function collectThumbnailAnnictIds(groups: VoteGroup[]) {
  return Array.from(
    new Set(
      groups.flatMap((group) =>
        group.items.slice(0, THUMBNAILS_PER_VOTE).map((item) => item.annictId),
      ),
    ),
  );
}

function formatSeasonLabel(season: string) {
  const match = season.match(/^(\d{4})-(spring|summer|autumn|winter)$/);
  if (!match) return season;
  return `${match[1]}年${getSeasonName(match[2] as Season)}`;
}

function formatVotedAt(createdAt: string) {
  return new Date(createdAt).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Tokyo",
  });
}
