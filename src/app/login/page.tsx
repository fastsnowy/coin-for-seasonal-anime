import { createSupabaseServerClient } from "@/lib/supabase/server";
import { siteName } from "@/config/constant";
import { SiteHeader } from "@/components/site-header";
import { Breadcrumb } from "@/components/breadcrumb";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AnnictOAuthButton } from "@/components/annict-oauth-button";
import { getAuthErrorMessage, sanitizeNextPath } from "@/lib/auth-redirect";
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
  const params = await searchParams;
  const nextPath = sanitizeNextPath(params.next);

  if (user && !user.is_anonymous) {
    redirect(nextPath);
  }

  return (
    <main className="min-h-dvh bg-background">
      <SiteHeader maxWidth="max-w-4xl" />

      <div className="container mx-auto max-w-md px-4 py-6">
        <Breadcrumb items={[{ label: "ログイン" }]} />

        <div className="py-10 text-center">
          <h1 className="mb-2 text-2xl font-extrabold tracking-tight">
            ログイン
          </h1>
          <p className="text-sm text-muted-foreground">
            連携済みのAnnictアカウントでログインします
          </p>
        </div>

        {params.error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{getAuthErrorMessage(params.error)}</AlertDescription>
          </Alert>
        )}

        <AnnictOAuthButton mode="login" nextPath={nextPath} />

        {user?.is_anonymous && (
          <div className="mt-8 rounded-lg border border-border bg-muted/50 p-4">
            <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
              まだAnnictアカウントを連携していない場合は、アカウント連携ページから現在の投票履歴を引き継ぐことができます。
            </p>
            <Link
              href="/link"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
            >
              <LinkIcon className="h-3.5 w-3.5" />
              アカウント連携ページへ
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
