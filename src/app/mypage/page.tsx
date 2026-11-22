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
import { Badge } from "@/components/ui/badge";
import { NumberRoll } from "@/components/ui/number-roll";
import {
  ArrowRight,
  BadgeCheck,
  ChevronRight,
  Coins,
  History,
  ShieldCheck,
  UserCircle,
} from "lucide-react";
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
    redirect("/login?next=/mypage");
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
        <h1 className="sr-only">マイページ</h1>

        <div className="stagger-children mt-4 space-y-8 sm:mt-6">
          <section
            aria-label="プロフィール"
            className="surface relative overflow-hidden rounded-2xl"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,var(--coin-muted)_0%,transparent_60%)]"
            />
            <div className="relative p-5">
              <div className="flex items-center gap-3.5">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt=""
                    className="size-14 shrink-0 rounded-full object-cover shadow-sm ring-2 ring-card outline outline-1 outline-coin/30"
                  />
                ) : (
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-muted ring-2 ring-coin/20">
                    <UserCircle
                      aria-hidden="true"
                      className="size-7 text-muted-foreground"
                    />
                  </div>
                )}
                <div className="min-w-0 space-y-1">
                  <p className="truncate text-lg font-extrabold tracking-tight">
                    {displayName}
                  </p>
                  <Badge variant="success">
                    <BadgeCheck aria-hidden="true" />
                    Annictアカウント連携済み
                  </Badge>
                </div>
              </div>

              <dl className="mt-5 grid grid-cols-3 divide-x divide-border border-t border-border pt-4">
                <Stat label="投票回数" value={voteGroups.length} unit="回" />
                <Stat label="シーズン" value={seasonCount} unit="期" />
                <Stat label="コイン" value={totalCoins} unit="枚" accent />
              </dl>
            </div>
          </section>

          <section aria-labelledby="recent-votes-heading">
            <SectionHeading
              id="recent-votes-heading"
              action={
                voteGroups.length > 0 ? (
                  <Link
                    href="/my-votes"
                    className="-my-2 -mr-2 inline-flex min-h-10 items-center gap-0.5 rounded-md px-2 text-xs font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/35"
                  >
                    すべて見る
                    <ChevronRight aria-hidden="true" className="size-3.5" />
                  </Link>
                ) : null
              }
            >
              最近の投票
            </SectionHeading>

            {recentGroups.length === 0 ? (
              <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border-strong bg-surface-sunken/60 px-6 py-12 text-center">
                <span className="flex size-12 items-center justify-center rounded-2xl border border-border bg-card shadow-sm">
                  <Coins aria-hidden="true" className="size-5 text-coin" />
                </span>
                <p className="text-sm text-muted-foreground">
                  まだ投票していません
                </p>
                <Button asChild size="md">
                  <Link href="/">
                    アニメに賭ける
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
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

          <section aria-labelledby="account-heading">
            <SectionHeading id="account-heading">アカウント</SectionHeading>
            <div className="surface divide-y divide-border overflow-hidden rounded-2xl">
              <Link
                href="/my-votes"
                className="group/row flex min-h-14 items-center justify-between gap-3 px-4 py-3 outline-none transition-colors hover:bg-accent/60 focus-visible:bg-accent/60 focus-visible:ring-[3px] focus-visible:ring-ring/35 focus-visible:ring-inset"
              >
                <span className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-surface-sunken text-muted-foreground">
                    <History aria-hidden="true" className="size-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">
                      投票履歴
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {voteGroups.length > 0
                        ? `全${voteGroups.length}件の投票を確認`
                        : "過去の投票を確認"}
                    </span>
                  </span>
                </span>
                <ChevronRight
                  aria-hidden="true"
                  className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out-quint group-hover/row:translate-x-0.5 motion-reduce:transition-none"
                />
              </Link>
              <Link
                href="/privacy"
                className="group/row flex min-h-14 items-center justify-between gap-3 px-4 py-3 outline-none transition-colors hover:bg-accent/60 focus-visible:bg-accent/60 focus-visible:ring-[3px] focus-visible:ring-ring/35 focus-visible:ring-inset"
              >
                <span className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-surface-sunken text-muted-foreground">
                    <ShieldCheck aria-hidden="true" className="size-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">
                      プライバシーポリシー
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      保存する情報と取り扱いについて
                    </span>
                  </span>
                </span>
                <ChevronRight
                  aria-hidden="true"
                  className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out-quint group-hover/row:translate-x-0.5 motion-reduce:transition-none"
                />
              </Link>
            </div>
          </section>

          <section aria-labelledby="danger-zone-heading">
            <SectionHeading id="danger-zone-heading" tone="danger">
              危険な操作
            </SectionHeading>
            <div className="rounded-2xl border border-destructive/25 bg-card shadow-xs">
              <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-5">
                <div className="space-y-1">
                  <p className="text-sm font-semibold">退会</p>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    退会すると現在のアカウントで投票履歴を参照できなくなります。投票データは匿名の投票として保持され、再登録しても過去の履歴は引き継がれません。
                  </p>
                </div>
                <div className="shrink-0">
                  <DeleteAccountDialog />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function SectionHeading({
  id,
  children,
  action,
  tone = "default",
}: {
  id: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  tone?: "default" | "danger";
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3 px-1">
      <h2
        id={id}
        className={`text-xs font-semibold tracking-wide ${tone === "danger" ? "text-destructive" : "text-muted-foreground"}`}
      >
        {children}
      </h2>
      {action}
    </div>
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
        <NumberRoll
          value={value}
          className={`text-2xl font-bold tracking-tight ${accent ? "text-coin-foreground" : ""}`}
        />
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
