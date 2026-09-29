import { createSupabaseServerClient } from "@/lib/supabase/server";
import { siteName } from "@/config/constant";
import { SiteHeader } from "@/components/site-header";
import { Breadcrumb } from "@/components/breadcrumb";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AnnictOAuthButton } from "@/components/annict-oauth-button";
import { getAuthErrorMessage } from "@/lib/auth-redirect";
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
      <SiteHeader maxWidth="max-w-4xl" />

      <div className="container mx-auto max-w-md px-4 py-6">
        <Breadcrumb items={[{ label: "アカウント連携" }]} />

        <div className="py-10 text-center">
          <h1 className="mb-2 text-2xl font-extrabold tracking-tight">
            アカウント連携
          </h1>
          <p className="text-sm text-muted-foreground">
            Annictアカウントを連携すると、今の投票履歴を引き継いだまま別のデバイスからもアクセスできます
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              {error === "exchange_failed" ||
              error === "callback_exception" ||
              error === "auth_callback_error"
                ? getAuthErrorMessage(error)
                : "連携エラーが発生しました。もう一度お試しください。"}
            </AlertDescription>
          </Alert>
        )}

        <AnnictOAuthButton mode="link" />

        <div className="mt-8 rounded-lg border border-border bg-muted/50 p-4">
          <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
            すでに別のデバイスでAnnictアカウントを連携済みの場合は、ログインページからログインしてください。
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
          >
            <LogIn className="h-3.5 w-3.5" />
            ログインページへ
          </Link>
        </div>
      </div>
    </main>
  );
}
