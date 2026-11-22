import { AspectRatio } from "@/components/ui/aspect-ratio";
import { type Anime } from "@/lib/anime-data";
import { getSeasonName, type Season } from "@/lib/seasons";
import { Badge } from "@/components/ui/badge";
import { NumberRoll } from "@/components/ui/number-roll";
import { ChevronRight, Coins } from "lucide-react";
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
  const href = `/results?id=${group.createdId}`;
  const votedAt = formatVotedAt(group.createdAt);

  return (
    <article
      aria-label={`${group.seasonLabel}の投票（${votedAt}）`}
      className="surface group/vote relative rounded-2xl p-4 transition-[border-color,box-shadow] duration-200 ease-out-quint hover:border-border-strong hover:shadow-md has-[a:focus-visible]:border-border-strong sm:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <Link
          href={href}
          className="-m-1 flex min-w-0 flex-1 flex-col gap-1.5 rounded-lg p-1 outline-none after:absolute after:inset-0 after:rounded-2xl after:content-[''] focus-visible:ring-[3px] focus-visible:ring-ring/35"
        >
          <span className="flex items-center gap-2">
            <Badge variant="neutral">{group.seasonLabel}</Badge>
            <ChevronRight
              aria-hidden="true"
              className="size-3.5 text-muted-foreground transition-transform duration-200 ease-out-quint group-hover/vote:translate-x-0.5 motion-reduce:transition-none"
            />
            <span className="sr-only">の結果を見る</span>
          </span>
          <time
            dateTime={group.createdAt}
            className="truncate text-xs text-muted-foreground"
          >
            {votedAt}
          </time>
        </Link>
        <div className="relative z-10 flex shrink-0 items-center gap-1">
          <div className="flex flex-col items-end">
            <span className="text-[11px] leading-none text-muted-foreground">
              合計
            </span>
            <span className="mt-1 flex items-center gap-1 text-coin-foreground">
              <Coins aria-hidden="true" className="size-4 text-coin" />
              <NumberRoll
                value={group.totalCoins}
                className="text-xl font-bold leading-none tracking-tight"
              />
              <span className="sr-only">枚</span>
            </span>
          </div>
          {actions}
        </div>
      </div>

      {thumbnails.length > 0 && (
        <div className="pointer-events-none mt-4">
          <ul
            aria-label="投票した作品"
            className="grid grid-cols-2 gap-2.5 sm:grid-cols-4"
          >
            {thumbnails.map((item) => {
              const anime = animeById.get(item.annictId);
              return (
                <li key={item.annictId} className="min-w-0 space-y-1.5">
                  <AspectRatio
                    ratio={16 / 9}
                    className="relative overflow-hidden rounded-lg bg-surface-sunken ring-1 ring-border ring-inset"
                  >
                    {anime?.image ? (
                      <img
                        src={anime.image}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-300 ease-out-quint group-hover/vote:scale-[1.02] motion-reduce:transition-none"
                      />
                    ) : null}
                    <span className="absolute right-1 bottom-1 inline-flex items-center gap-0.5 rounded-full bg-black/65 px-1.5 py-px text-[10px] font-semibold tabular-nums text-white backdrop-blur-sm">
                      <Coins
                        aria-hidden="true"
                        className="size-2.5 text-coin"
                      />
                      {item.coinValue}
                      <span className="sr-only">枚</span>
                    </span>
                  </AspectRatio>
                  <p className="line-clamp-1 text-[11px] text-muted-foreground">
                    {anime?.title ?? `作品ID: ${item.annictId}`}
                  </p>
                </li>
              );
            })}
          </ul>

          {restCount > 0 && (
            <p className="mt-2.5 text-[11px] text-muted-foreground">
              ほか{restCount}作品
            </p>
          )}
        </div>
      )}
    </article>
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
