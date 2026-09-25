import { Breadcrumb } from "@/components/breadcrumb";
import { DeleteAccountDialog } from "@/components/delete-account-dialog";
import { SiteHeader } from "@/components/site-header";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { siteName } from "@/config/constant";
import { DB_TABLES } from "@/config/database";
import { type Anime, getAnimeByIds } from "@/lib/anime-data";
import { getSeasonName, type Season } from "@/lib/seasons";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ArrowRight, ChevronRight, Coins, UserCircle } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: `マイページ | ${siteName}`,
};

const RECENT_VOTE_COUNT = 4;
const THUMBNAILS_PER_VOTE = 4;

type VoteItem = {
  annictId: number;
  coinValue: number;
};

type VoteGroup = {
  createdId: string;
  season: string;
  seasonLabel: string;
  createdAt: string;
  totalCoins: number;
  items: VoteItem[];
};

export default async function MyPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.is_anonymous) {
    redirect("/login");
  }

  const displayName =
    (user.user_metadata?.name as string) ??
    (user.user_metadata?.username as string) ??
    (user.user_metadata?.full_name as string) ??
    user.email ??
    "ユーザー";
  const avatarUrl = (user.user_metadata?.avatar_url as string) ?? null;

  const { data: votes } = await supabase
    .from(DB_TABLES.COINS)
    .select("created_id, season, coin_value, annict_id, created_at")
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  const voteGroups = groupVotes(votes ?? []);
  const recentGroups = voteGroups.slice(0, RECENT_VOTE_COUNT);
  const totalCoins = (votes ?? []).reduce((sum, v) => sum + v.coin_value, 0);
  const seasonCount = new Set(voteGroups.map((group) => group.season)).size;
  const animeById = await fetchAnimeForGroups(recentGroups);

  return (
    <main className="min-h-dvh bg-background">
      <SiteHeader maxWidth="max-w-4xl" />
      <div className="container mx-auto max-w-2xl px-4 py-6">
        <Breadcrumb items={[{ label: "マイページ" }]} />

        <section className="relative mt-6 overflow-hidden rounded-2xl border border-border bg-card">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,var(--coin-muted)_0%,transparent_60%)]" />
          <div className="relative p-5">
            <div className="flex items-center gap-3">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-coin/30"
                />
              ) : (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-muted ring-2 ring-coin/20">
                  <UserCircle className="h-7 w-7 text-muted-foreground" />
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-lg font-extrabold tracking-tight">
                  {displayName}
                </p>
                <p className="text-xs text-muted-foreground">
                  Annictアカウント連携済み
                </p>
              </div>
            </div>

            <dl className="mt-5 grid grid-cols-3 divide-x divide-border border-t border-border pt-4">
              <Stat label="投票回数" value={voteGroups.length} unit="回" />
              <Stat label="シーズン" value={seasonCount} unit="期" />
              <Stat label="コイン" value={totalCoins} unit="枚" accent />
            </dl>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <h2 className="text-sm font-bold">最近の投票</h2>
            {voteGroups.length > 0 && (
              <Link
                href="/my-votes"
                className="inline-flex items-center gap-0.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                すべての履歴
                <ChevronRight className="h-3 w-3" />
              </Link>
            )}
          </div>

          {recentGroups.length === 0 ? (
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border py-14">
              <Coins className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                まだ投票していません
              </p>
              <Link href="/">
                <Button size="sm" className="gap-1.5">
                  アニメに賭ける
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {recentGroups.map((group) => (
                <li key={group.createdId}>
                  <VoteGroupCard group={group} animeById={animeById} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-10 border-t border-border pt-6">
          <h2 className="text-sm font-bold text-destructive">アカウント管理</h2>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            退会すると現在のアカウントで投票履歴を参照できなくなります。投票データは匿名の投票として保持され、再登録しても過去の履歴は引き継がれません。
          </p>
          <div className="mt-3">
            <DeleteAccountDialog />
          </div>
        </section>
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
  unit,
  accent,
}: {
  label: string;
  value: number;
  unit: string;
  accent?: boolean;
}) {
  return (
    <div className="px-3 first:pl-0 last:pr-0">
      <dt className="text-[11px] text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 flex items-baseline gap-0.5">
        <span
          className={`text-2xl font-bold tabular-nums ${accent ? "text-coin" : ""}`}
        >
          {value.toLocaleString()}
        </span>
        <span className="text-[11px] text-muted-foreground">{unit}</span>
      </dd>
    </div>
  );
}

function VoteGroupCard({
  group,
  animeById,
}: {
  group: VoteGroup;
  animeById: Map<number, Anime>;
}) {
  const thumbnails = group.items.slice(0, THUMBNAILS_PER_VOTE);
  const restCount = group.items.length - thumbnails.length;

  return (
    <Link
      href={`/results?id=${group.createdId}`}
      className="block rounded-2xl border border-border bg-card p-4 transition-colors hover:border-coin/30"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {group.seasonLabel}
          </span>
          <span className="truncate text-xs text-muted-foreground">
            {formatVotedAt(group.createdAt)}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <Coins className="h-4 w-4 text-coin" />
          <span className="text-lg font-bold tabular-nums text-coin">
            {group.totalCoins}
          </span>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
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
                <span className="absolute bottom-1 right-1 rounded-full bg-black/65 px-1.5 text-[10px] font-semibold tabular-nums text-white backdrop-blur-sm">
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
  );
}

function groupVotes(
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

async function fetchAnimeForGroups(groups: VoteGroup[]) {
  const annictIds = Array.from(
    new Set(
      groups.flatMap((group) =>
        group.items.slice(0, THUMBNAILS_PER_VOTE).map((item) => item.annictId),
      ),
    ),
  );

  if (annictIds.length === 0) return new Map<number, Anime>();

  try {
    const animeList = await getAnimeByIds(annictIds);
    return new Map(animeList.map((anime) => [anime.id, anime]));
  } catch (error) {
    console.error("Failed to fetch anime for recent votes", error);
    return new Map<number, Anime>();
  }
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
