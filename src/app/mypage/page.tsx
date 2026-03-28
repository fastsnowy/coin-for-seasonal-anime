import { Breadcrumb } from "@/components/breadcrumb";
import { DeleteAccountDialog } from "@/components/delete-account-dialog";
import { SiteHeader } from "@/components/site-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { siteName } from "@/config/constant";
import { DB_TABLES } from "@/config/database";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Coins, History, UserCircle } from "lucide-react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: `マイページ | ${siteName}`,
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
    .select("created_id, coin_value")
    .eq("user_id", user.id)
    .is("deleted_at", null);

  const voteCount = new Set(votes?.map((vote) => vote.created_id) ?? []).size;
  const totalCoins = (votes ?? []).reduce((sum, vote) => sum + vote.coin_value, 0);

  return (
    <main className="min-h-dvh bg-background">
      <SiteHeader maxWidth="max-w-4xl" />
      <div className="container mx-auto max-w-2xl px-4 py-6">
        <Breadcrumb items={[{ label: "マイページ" }]} />

        <div className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">ユーザー情報</CardTitle>
              <CardDescription>Annict連携アカウントの情報です</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="h-11 w-11 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-muted">
                    <UserCircle className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{displayName}</p>
                  <p className="text-xs text-muted-foreground">
                    Annictアカウント連携済み
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">投票サマリー</CardTitle>
              <CardDescription>削除されていない投票の集計です</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-border bg-muted/30 p-3">
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <History className="h-3.5 w-3.5" />
                    投票回数
                  </p>
                  <p className="mt-1 text-2xl font-bold tabular-nums">{voteCount}</p>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-3">
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Coins className="h-3.5 w-3.5" />
                    合計コイン
                  </p>
                  <p className="mt-1 text-2xl font-bold tabular-nums text-coin">
                    {totalCoins}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base text-destructive">アカウント管理</CardTitle>
              <CardDescription>
                退会すると現在のアカウントで投票履歴を参照できなくなります。
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-muted-foreground leading-relaxed">
                投票データは匿名の投票として保持されます。再登録しても過去の投票履歴は引き継がれません。
              </p>
              <DeleteAccountDialog />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
