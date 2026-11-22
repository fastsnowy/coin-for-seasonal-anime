import { createSupabaseServerClient } from "@/lib/supabase/server";
import { siteName } from "@/config/constant";
import { SiteHeader } from "@/components/site-header";
import { Breadcrumb } from "@/components/breadcrumb";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AnnictOAuthButton } from "@/components/annict-oauth-button";
import { getAuthErrorMessage } from "@/lib/auth-redirect";
import { History, KeyRound, LogIn, MonitorSmartphone } from "lucide-react";
import { AuthCard, AuthFooterLink } from "../login/_components/auth-card";

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
  const errorMessage = error
    ? error === "exchange_failed" ||
      error === "callback_exception" ||
      error === "auth_callback_error"
      ? getAuthErrorMessage(error)
      : "連携エラーが発生しました。もう一度お試しください。"
    : undefined;

  return (
    <main className="min-h-dvh bg-background">
      <SiteHeader maxWidth="max-w-4xl" />

      <div className="container mx-auto max-w-md px-4 py-6 sm:py-10">
        <Breadcrumb items={[{ label: "アカウント連携" }]} />

        <AuthCard
          title="アカウント連携"
          description="Annictアカウントを連携すると、今の投票履歴を引き継いだまま別のデバイスからもアクセスできます"
          error={errorMessage}
          benefits={[
            {
              icon: History,
              text: "これまでの投票履歴はそのまま引き継がれます",
            },
            {
              icon: MonitorSmartphone,
              text: "スマートフォンとPCなど、複数のデバイスで同期できます",
            },
            {
              icon: KeyRound,
              text: "パスワードは保存しません。認証はAnnictで行われます",
            },
          ]}
          footer={
            <AuthFooterLink
              description="すでに別のデバイスでAnnictアカウントを連携済みの場合は、ログインページからログインしてください。"
              href="/login"
              label="ログインページへ"
              icon={LogIn}
            />
          }
        >
          <AnnictOAuthButton mode="link" />
        </AuthCard>
      </div>
    </main>
  );
}
