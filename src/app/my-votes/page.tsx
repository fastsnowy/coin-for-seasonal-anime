import { Breadcrumb } from "@/components/breadcrumb";
import { VoteCardActions } from "@/components/vote-card-actions";
import { siteName } from "@/config/constant";
import { DB_TABLES } from "@/config/database";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSeasonName, type Season } from "@/lib/seasons";
import { Coins, LogIn, History } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: `投票履歴 | ${siteName}`,
};

type VoteGroup = {
  createdId: string;
  season: string;
  seasonLabel: string;
  totalCoins: number;
  animeCount: number;
  createdAt: string;
};

export default async function MyVotesPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <PageShell>
        <EmptyState
          icon={<LogIn className="w-10 h-10 text-muted-foreground/40" />}
          title="ログインが必要です"
          description="投票履歴を確認するにはログインしてください。"
          action={
            <Link href="/login">
              <Button className="gap-2">
                <LogIn className="w-4 h-4" />
                ログイン
              </Button>
            </Link>
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
      <PageShell>
        <EmptyState
          icon={<History className="w-10 h-10 text-muted-foreground/40" />}
          title="投票履歴がありません"
          description="まだ投票していません。アニメにコインを賭けてみましょう！"
          action={
            <Link href="/">
              <Button className="gap-2">
                <Coins className="w-4 h-4" />
                投票する
              </Button>
            </Link>
          }
        />
      </PageShell>
    );
  }

  const grouped = new Map<string, VoteGroup>();
  for (const vote of votes) {
    const existing = grouped.get(vote.created_id);
    if (existing) {
      existing.totalCoins += vote.coin_value;
      existing.animeCount += 1;
    } else {
      const seasonMatch = vote.season.match(
        /^(\d{4})-(spring|summer|autumn|winter)$/,
      );
      const seasonLabel = seasonMatch
        ? `${seasonMatch[1]}年${getSeasonName(seasonMatch[2] as Season)}`
        : vote.season;

      grouped.set(vote.created_id, {
        createdId: vote.created_id,
        season: vote.season,
        seasonLabel,
        totalCoins: vote.coin_value,
        animeCount: 1,
        createdAt: vote.created_at,
      });
    }
  }

  const voteGroups = Array.from(grouped.values());

  return (
    <PageShell>
      <div className="mt-6 mb-8 text-center space-y-1">
        <h1 className="text-2xl font-extrabold tracking-tight">投票履歴</h1>
        <p className="text-sm text-muted-foreground">
          {user.is_anonymous
            ? "匿名ユーザーとしての投票履歴です"
            : `${(user.user_metadata?.name as string) ?? (user.user_metadata?.user_name as string) ?? "アカウント"} の投票履歴`}
        </p>
      </div>

      <div className="space-y-3">
        {voteGroups.map((group) => (
          <div
            key={group.createdId}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <Link
                href={`/results?id=${group.createdId}`}
                className="flex-1 min-w-0 hover:opacity-80 transition-opacity"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {group.seasonLabel}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {group.animeCount}作品
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(group.createdAt).toLocaleDateString("ja-JP", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZone: "Asia/Tokyo",
                    })}
                  </p>
                </div>
              </Link>
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-coin" />
                  <span className="font-bold text-lg tabular-nums text-coin">
                    {group.totalCoins}
                  </span>
                </div>
                <VoteCardActions createdId={group.createdId} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {user.is_anonymous && (
        <div className="mt-8 rounded-lg border border-border bg-muted/50 p-4">
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
            現在、匿名ユーザーとしてご利用中です。Annictアカウントを連携すると、別のデバイスからも投票履歴を確認できるようになります。
          </p>
          <Link href="/link">
            <Button variant="outline" size="sm" className="gap-1.5">
              <LogIn className="w-3.5 h-3.5" />
              Annictアカウントを連携
            </Button>
          </Link>
        </div>
      )}
    </PageShell>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-dvh bg-background">
      <SiteHeader maxWidth="max-w-4xl" />
      <div className="container mx-auto max-w-2xl px-4 py-6">
        <Breadcrumb items={[{ label: "投票履歴" }]} />
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
