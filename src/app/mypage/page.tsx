import { Breadcrumb } from "@/components/breadcrumb";
import { DeleteAccountDialog } from "@/components/delete-account-dialog";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import {
  VoteGroupCard,
  collectThumbnailAnnictIds,
  groupVotes,
} from "@/components/vote-group-card";
import { siteName } from "@/config/constant";
import { DB_TABLES } from "@/config/database";
import { type Anime, getAnimeByIds } from "@/lib/anime-data";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ArrowRight, ChevronRight, Coins, History, UserCircle } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: `マイページ | ${siteName}`,
};

const RECENT_VOTE_COUNT = 4;

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
  const animeById = await fetchAnimeByIds(
    collectThumbnailAnnictIds(recentGroups),
  );

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

        <section className="mt-6">
          <Link
            href="/my-votes"
            className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3 transition-colors hover:border-coin/30"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                <History className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-bold">投票履歴</p>
                <p className="text-xs text-muted-foreground">
                  {voteGroups.length > 0
                    ? `全${voteGroups.length}件の投票を確認`
                    : "過去の投票を確認"}
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          </Link>
        </section>

        <section className="mt-8">
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <h2 className="text-sm font-bold">最近の投票</h2>
            {voteGroups.length > 0 && (
              <Link
                href="/my-votes"
                className="inline-flex items-center gap-0.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                すべて見る
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

async function fetchAnimeByIds(annictIds: number[]) {
  if (annictIds.length === 0) return new Map<number, Anime>();

  try {
    const animeList = await getAnimeByIds(annictIds);
    return new Map(animeList.map((anime) => [anime.id, anime]));
  } catch (error) {
    console.error("Failed to fetch anime for recent votes", error);
    return new Map<number, Anime>();
  }
}
