import { createSupabaseServerClient } from "@/lib/supabase/server";
import { siteName } from "@/config/constant";
import { SiteHeader } from "@/components/site-header";
import { Breadcrumb } from "@/components/breadcrumb";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AnnictOAuthButton } from "@/components/annict-oauth-button";
import { getAuthErrorMessage, sanitizeNextPath } from "@/lib/auth-redirect";
import { History, KeyRound, LinkIcon, MonitorSmartphone } from "lucide-react";
import { AuthCard, AuthFooterLink } from "./_components/auth-card";

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

      <div className="container mx-auto max-w-md px-4 py-6 sm:py-10">
        <Breadcrumb items={[{ label: "ログイン" }]} />

        <AuthCard
          title="ログイン"
          description="連携済みのAnnictアカウントでログインします"
          error={params.error ? getAuthErrorMessage(params.error) : undefined}
          benefits={[
            {
              icon: MonitorSmartphone,
              text: "どのデバイスからでも同じ投票履歴にアクセスできます",
            },
            {
              icon: History,
              text: "過去シーズンの投票をマイページでまとめて確認できます",
            },
            {
              icon: KeyRound,
              text: "パスワードは保存しません。認証はAnnictで行われます",
            },
          ]}
          footer={
            user?.is_anonymous ? (
              <AuthFooterLink
                description="まだAnnictアカウントを連携していない場合は、アカウント連携ページから現在の投票履歴を引き継ぐことができます。"
                href="/link"
                label="アカウント連携ページへ"
                icon={LinkIcon}
              />
            ) : undefined
          }
        >
          <AnnictOAuthButton mode="login" nextPath={nextPath} />
        </AuthCard>
      </div>
    </main>
  );
}
