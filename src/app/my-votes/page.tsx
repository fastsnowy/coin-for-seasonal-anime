import { Breadcrumb } from "@/components/breadcrumb";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { VoteCardActions } from "@/components/vote-card-actions";
import {
  VoteGroupCard,
  collectThumbnailAnnictIds,
  groupVotes,
} from "@/components/vote-group-card";
import { siteName } from "@/config/constant";
import { DB_TABLES } from "@/config/database";
import { type Anime, getAnimeByIds } from "@/lib/anime-data";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { BlurText } from "@/components/ui/blur-text";
import { NumberRoll } from "@/components/ui/number-roll";
import { ArrowRight, Coins, History, LinkIcon, LogIn } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: `投票履歴 | ${siteName}`,
};

export default async function MyVotesPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLinkedAccount = Boolean(user && !user.is_anonymous);

  if (!user) {
    return (
      <PageShell isLinkedAccount={false}>
        <EmptyState
          icon={<LogIn aria-hidden="true" className="size-6" />}
          title="ログインが必要です"
          description="投票履歴を確認するにはログインしてください。"
          action={
            <Button asChild variant="solid" size="md">
              <Link href="/login?next=/my-votes">
                <LogIn aria-hidden="true" />
                ログイン
              </Link>
            </Button>
          }
        />
      </PageShell>
    );
  }

  const { data: votes } = await supabase
    .from(DB_TABLES.COINS)
    .select("created_id, season, coin_value, annict_id, created_at")
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (!votes || votes.length === 0) {
    return (
      <PageShell isLinkedAccount={isLinkedAccount}>
        <EmptyState
          icon={<History aria-hidden="true" className="size-6" />}
          title="投票履歴がありません"
          description="まだ投票していません。アニメにコインを賭けてみましょう！"
          action={
            <Button asChild size="md">
              <Link href="/">
                <Coins aria-hidden="true" />
                投票する
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          }
        />
      </PageShell>
    );
  }

  const voteGroups = groupVotes(votes);
  const animeById = await fetchAnimeByIds(
    collectThumbnailAnnictIds(voteGroups),
  );
  const totalCoins = voteGroups.reduce(
    (sum, group) => sum + group.totalCoins,
    0,
  );

  return (
    <PageShell isLinkedAccount={isLinkedAccount}>
      <header className="mt-4 mb-6 flex flex-wrap items-end justify-between gap-x-4 gap-y-3 sm:mt-6">
        <div className="min-w-0 space-y-1">
          <BlurText
            as="h1"
            text="投票履歴"
            className="text-2xl font-extrabold tracking-tight"
          />
          <p className="text-sm text-muted-foreground">
            {user.is_anonymous
              ? "匿名ユーザーとしての投票履歴です"
              : `${(user.user_metadata?.name as string) ?? (user.user_metadata?.user_name as string) ?? "アカウント"} の投票履歴`}
          </p>
        </div>
        <dl className="flex items-center gap-4 rounded-xl border border-border bg-surface-sunken px-4 py-2.5">
          <div>
            <dt className="text-[11px] text-muted-foreground">投票</dt>
            <dd className="flex items-baseline gap-0.5 font-bold">
              <NumberRoll value={voteGroups.length} className="text-lg" />
              <span className="text-[11px] font-normal text-muted-foreground">
                回
              </span>
            </dd>
          </div>
          <div aria-hidden="true" className="h-8 w-px bg-border" />
          <div>
            <dt className="text-[11px] text-muted-foreground">合計コイン</dt>
            <dd className="flex items-baseline gap-0.5 font-bold text-coin-foreground">
              <NumberRoll value={totalCoins} className="text-lg" />
              <span className="text-[11px] font-normal text-muted-foreground">
                枚
              </span>
            </dd>
          </div>
        </dl>
      </header>

      {user.is_anonymous && (
        <aside className="mb-6 flex flex-col gap-3 rounded-xl border border-coin/20 bg-coin-muted p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-relaxed text-foreground/80">
            現在、匿名ユーザーとしてご利用中です。Annictアカウントを連携すると、別のデバイスからも投票履歴を確認できるようになります。
          </p>
          <Button
            asChild
            variant="outline"
            size="md"
            className="shrink-0 self-start sm:self-auto"
          >
            <Link href="/link">
              <LinkIcon aria-hidden="true" />
              Annictアカウントを連携
            </Link>
          </Button>
        </aside>
      )}

      <ul aria-label="投票一覧" className="stagger-children space-y-3">
        {voteGroups.map((group) => (
          <li key={group.createdId}>
            <VoteGroupCard
              group={group}
              animeById={animeById}
              actions={<VoteCardActions createdId={group.createdId} />}
            />
          </li>
        ))}
      </ul>
    </PageShell>
  );
}

function PageShell({
  children,
  isLinkedAccount,
}: {
  children: React.ReactNode;
  isLinkedAccount: boolean;
}) {
  return (
    <main className="min-h-dvh bg-background">
      <SiteHeader maxWidth="max-w-4xl" />
      <div className="container mx-auto max-w-2xl px-4 py-6">
        <Breadcrumb
          items={
            isLinkedAccount
              ? [
                  { label: "マイページ", href: "/mypage" },
                  { label: "投票履歴" },
                ]
              : [{ label: "投票履歴" }]
          }
        />
        {children}
      </div>
    </main>
  );
}

function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: React.ReactNode;
}) {
  return (
    <section className="mt-6 flex flex-col items-center justify-center gap-5 rounded-2xl border border-dashed border-border-strong bg-surface-sunken/60 px-6 py-16 text-center animate-fade-up">
      <span className="flex size-14 items-center justify-center rounded-2xl border border-border bg-card text-muted-foreground shadow-sm">
        {icon}
      </span>
      <div className="space-y-1.5">
        <h1 className="text-lg font-bold">{title}</h1>
        <p className="max-w-[32ch] text-sm leading-relaxed text-muted-foreground text-pretty">
          {description}
        </p>
      </div>
      {action}
    </section>
  );
}

async function fetchAnimeByIds(annictIds: number[]) {
  if (annictIds.length === 0) return new Map<number, Anime>();

  try {
    const animeList = await getAnimeByIds(annictIds);
    return new Map(animeList.map((anime) => [anime.id, anime]));
  } catch (error) {
    console.error("Failed to fetch anime for vote history", error);
    return new Map<number, Anime>();
  }
}
