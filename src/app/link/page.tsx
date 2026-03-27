import { createSupabaseServerClient } from "@/lib/supabase/server";
import { siteName } from "@/config/constant";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/user-menu";
import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AnnictOAuthButton } from "@/components/annict-oauth-button";
import { LogIn } from "lucide-react";

export const metadata: Metadata = {
  title: `アカウント連携 | ${siteName}`,
};

export default async function LinkPage({
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
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto max-w-4xl px-4 h-12 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm font-bold hover:text-foreground transition-colors"
          >
            {siteName}
          </Link>
          <div className="flex items-center gap-1">
            <UserMenu />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-md px-4 py-16">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold tracking-tight mb-2">
            アカウント連携
          </h1>
          <p className="text-sm text-muted-foreground">
            Annictアカウントを連携すると、今の投票履歴を引き継いだまま別のデバイスからもアクセスできます
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
            連携エラーが発生しました。もう一度お試しください。
          </div>
        )}

        <AnnictOAuthButton mode="link" />

        <div className="mt-8 rounded-lg border border-border bg-muted/50 p-4">
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
            すでに別のデバイスでAnnictアカウントを連携済みの場合は、ログインページからログインしてください。
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
          >
            <LogIn className="w-3.5 h-3.5" />
            ログインページへ
          </Link>
        </div>
      </div>
    </main>
  );
}
