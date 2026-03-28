import { createSupabaseServerClient } from "@/lib/supabase/server";
import { siteName } from "@/config/constant";
import { SiteHeader } from "@/components/site-header";
import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AnnictOAuthButton } from "@/components/annict-oauth-button";
import { LinkIcon } from "lucide-react";

export const metadata: Metadata = {
  title: `ログイン | ${siteName}`,
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user && !user.is_anonymous) {
    redirect("/");
  }

  const { error } = await searchParams;

  return (
    <main className="min-h-dvh bg-background">
      <SiteHeader maxWidth="max-w-4xl" />

      <div className="container mx-auto max-w-md px-4 py-16">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold tracking-tight mb-2">
            ログイン
          </h1>
          <p className="text-sm text-muted-foreground">
            連携済みのAnnictアカウントでログインします
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
            認証エラーが発生しました。もう一度お試しください。
          </div>
        )}

        <AnnictOAuthButton mode="login" />

        {user?.is_anonymous && (
          <div className="mt-8 rounded-lg border border-border bg-muted/50 p-4">
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              まだAnnictアカウントを連携していない場合は、アカウント連携ページから現在の投票履歴を引き継ぐことができます。
            </p>
            <Link
              href="/link"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
            >
              <LinkIcon className="w-3.5 h-3.5" />
              アカウント連携ページへ
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
