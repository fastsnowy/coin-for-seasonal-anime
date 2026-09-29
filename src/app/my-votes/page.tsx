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
import { Coins, History, LogIn } from "lucide-react";
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
          icon={<LogIn className="w-10 h-10 text-muted-foreground/40" />}
          title="ログインが必要です"
          description="投票履歴を確認するにはログインしてください。"
          action={
            <Button asChild className="gap-2">
              <Link href="/login?next=/my-votes">
                <LogIn className="h-4 w-4" />
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
          icon={<History className="w-10 h-10 text-muted-foreground/40" />}
          title="投票履歴がありません"
          description="まだ投票していません。アニメにコインを賭けてみましょう！"
          action={
            <Button asChild className="gap-2">
              <Link href="/">
                <Coins className="h-4 w-4" />
                投票する
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

  return (
    <PageShell isLinkedAccount={isLinkedAccount}>
      <div className="mt-6 mb-8 text-center space-y-1">
        <h1 className="text-2xl font-extrabold tracking-tight">投票履歴</h1>
        <p className="text-sm text-muted-foreground">
          {user.is_anonymous
            ? "匿名ユーザーとしての投票履歴です"
            : `${(user.user_metadata?.name as string) ?? (user.user_metadata?.user_name as string) ?? "アカウント"} の投票履歴`}
        </p>
      </div>

      <ul className="space-y-3">
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

      {user.is_anonymous && (
        <div className="mt-8 rounded-lg border border-border bg-muted/50 p-4">
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
            現在、匿名ユーザーとしてご利用中です。Annictアカウントを連携すると、別のデバイスからも投票履歴を確認できるようになります。
          </p>
          <Button asChild variant="outline" size="sm" className="gap-1.5">
            <Link href="/link">
              <LogIn className="h-3.5 w-3.5" />
              Annictアカウントを連携
            </Link>
          </Button>
        </div>
      )}
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
    <div className="flex flex-col items-center justify-center gap-5 py-20">
      {icon}
      <div className="text-center space-y-1.5">
        <h1 className="text-lg font-bold">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
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
