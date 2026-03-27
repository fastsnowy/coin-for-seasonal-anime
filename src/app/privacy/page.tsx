import { ThemeToggle } from "@/components/theme-toggle";
import { Breadcrumb } from "@/components/breadcrumb";
import { siteName } from "@/config/constant";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `プライバシーポリシー | ${siteName}`,
};

export default function PrivacyPage() {
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

      <div className="container mx-auto max-w-2xl px-4 py-6">
        <Breadcrumb items={[{ label: "プライバシーポリシー" }]} />

        <article className="mt-6 prose prose-sm prose-zinc dark:prose-invert max-w-none">
          <h1 className="text-2xl font-extrabold tracking-tight mb-8">
            プライバシーポリシー
          </h1>

          <p className="text-muted-foreground">
            {siteName}（以下「本サービス」）は、ユーザーのプライバシーを尊重し、個人情報の保護に努めます。本プライバシーポリシーでは、本サービスにおける情報の収集・利用・管理について説明します。
          </p>

          <Section title="1. 収集する情報">
            <p>本サービスでは、以下の情報を収集する場合があります。</p>
            <SubSection title="匿名認証">
              <p>
                本サービスにアクセスした際、匿名ユーザーとして自動的にセッションが作成されます。この際、一意の匿名ユーザーIDが生成されますが、個人を特定する情報は収集しません。
              </p>
            </SubSection>
            <SubSection title="アカウント連携（任意）">
              <p>
                ユーザーが任意で外部アカウントを連携する場合、OAuthプロバイダから以下の情報を取得する場合があります。本サービスではパスワードの管理は一切行いません。
              </p>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>
                  Discordアカウント情報（ユーザーID、ユーザー名等、Discordが提供する基本プロフィール情報）
                </li>
                <li>
                  Googleアカウント情報（ユーザーID、メールアドレス等、Googleが提供する基本プロフィール情報）
                </li>
              </ul>
              <p className="text-muted-foreground mt-2">
                なお、メールアドレスはOAuthプロバイダ（Google等）が認証フローの一環として自動的に送信する場合がありますが、本サービスではメールアドレスを用いた連絡やマーケティング等は行いません。
              </p>
            </SubSection>
            <SubSection title="投票データ">
              <p>
                ユーザーが投票した内容（対象アニメ、賭けたコイン数、投票日時）をデータベースに保存します。
              </p>
            </SubSection>
          </Section>

          <Section title="2. 情報の利用目的">
            <p>収集した情報は、以下の目的で利用します。</p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>投票機能の提供および投票結果の表示</li>
              <li>投票履歴の管理・閲覧機能の提供</li>
              <li>サービスの改善・運用のための統計データの作成</li>
            </ul>
          </Section>

          <Section title="3. Cookie・ローカルストレージの使用">
            <p>本サービスでは、以下の技術を使用しています。</p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>
                <strong>Cookie</strong>
                ：認証セッションの管理に使用します（Supabase
                Authが発行するセッショントークン）。
              </li>
              <li>
                <strong>ローカルストレージ</strong>
                ：投票のメタ情報（削除キー等）の一時保存に使用します。
              </li>
            </ul>
          </Section>

          <Section title="4. 第三者サービスの利用">
            <p>本サービスでは、以下の第三者サービスを利用しています。</p>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>
                <strong>Supabase</strong>
                ：データベース・認証基盤として利用。ユーザーデータはSupabaseのインフラストラクチャ上に保存されます。
                <br />
                <a
                  href="https://supabase.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Supabase Privacy Policy
                </a>
              </li>
              <li>
                <strong>Vercel</strong>
                ：ホスティングサービスとして利用。アクセスログ等がVercelのインフラ上で処理される場合があります。
                <br />
                <a
                  href="https://vercel.com/legal/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Vercel Privacy Policy
                </a>
              </li>
              <li>
                <strong>Annict</strong>
                ：アニメ情報の取得に利用。ユーザーの個人情報はAnnictに送信しません。
              </li>
            </ul>
          </Section>

          <Section title="5. データの保持と削除">
            <p>
              投票データはユーザーが削除操作を行うまで保持されます（論理削除方式）。アカウントの削除を希望する場合は、下記の連絡先までお問い合わせください。
            </p>
          </Section>

          <Section title="6. セキュリティ">
            <p>
              本サービスでは、以下の対策によりユーザーデータの保護に努めています。
            </p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>OAuth認証のみを採用し、パスワードの保存・管理を行わない設計</li>
              <li>データベースへのアクセス制御（Row Level Security）</li>
              <li>通信の暗号化（HTTPS）</li>
              <li>認証トークンの適切な管理</li>
            </ul>
          </Section>

          <Section title="7. ポリシーの変更">
            <p>
              本プライバシーポリシーは、必要に応じて変更される場合があります。重要な変更がある場合は、本ページにて告知します。
            </p>
          </Section>

          <Section title="8. お問い合わせ">
            <p>
              本プライバシーポリシーに関するお問い合わせは、サービスのGitHubリポジトリのIssueにてお願いします。
            </p>
          </Section>

          <p className="text-xs text-muted-foreground mt-10 pt-6 border-t border-border/50">
            最終更新日: 2026年3月28日
          </p>
        </article>
      </div>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-bold mb-3">{title}</h2>
      {children}
    </section>
  );
}

function SubSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-3">
      <h3 className="text-sm font-semibold mb-1.5">{title}</h3>
      {children}
    </div>
  );
}
