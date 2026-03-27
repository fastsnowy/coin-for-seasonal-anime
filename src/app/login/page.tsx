import { createSupabaseServerClient } from "@/lib/supabase/server";
import { siteName } from "@/config/constant";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import type { Metadata } from "next";
import { LoginForm } from "@/components/login-form";
import { redirect } from "next/navigation";

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
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto max-w-4xl px-4 h-12 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm font-bold hover:text-foreground transition-colors"
          >
            {siteName}
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <div className="container mx-auto max-w-md px-4 py-16">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold tracking-tight mb-2">
            アカウント連携
          </h1>
          <p className="text-sm text-muted-foreground">
            外部アカウントを連携すると、別のデバイスからも投票履歴を確認できます
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
            認証エラーが発生しました。もう一度お試しください。
          </div>
        )}

        <LoginForm />
      </div>
    </main>
  );
}
