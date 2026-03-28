import { SiteHeader } from "@/components/site-header";
import { Breadcrumb } from "@/components/breadcrumb";
import { siteName } from "@/config/constant";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `プライバシーポリシー | ${siteName}`,
};

export default function PrivacyPage() {
  return (
    <main className="min-h-dvh bg-background">
      <SiteHeader maxWidth="max-w-4xl" />

      <div className="container mx-auto max-w-2xl px-4 py-6">
        <Breadcrumb items={[{ label: "プライバシーポリシー" }]} />

        <article className="mt-6 prose prose-sm prose-zinc dark:prose-invert max-w-none">
          <h1 className="text-2xl font-extrabold tracking-tight mb-8">
            プライバシーポリシー
          </h1>

          <p className="text-muted-foreground">
            {siteName}
            （旧
            coin-for-seasonal-anime、以下「本サービス」）は、ユーザーのプライバシーを尊重します。本プライバシーポリシーでは、本サービスにおける情報の取り扱いについて説明します。
          </p>
          <p className="text-muted-foreground mt-4">
            <strong className="text-foreground">基本方針</strong>
            ：本サービスは、マーケティングや行動ターゲティングを目的とした個人情報の収集は行いません。保存・利用する情報は、投票機能の提供、投票履歴の表示・管理、および投票結果の集計表示に必要な範囲に限ります。Annict
            アカウントとの連携（ログイン）は任意であり、複数デバイス間での投票データの同期や、匿名利用時からのデータ引き継ぎに利用できます。
          </p>

          <Section title="1. 収集する情報">
            <p>
              本サービスが永続的に保存する主なデータは、投票に関する記録です。あわせて、認証の仕組みに伴い、以下の情報を扱う場合があります。
            </p>
            <SubSection title="投票データ">
              <p>
                ユーザーが投票した内容（対象アニメ、賭けたコイン数、投票日時、本サービス内のユーザー識別子）をデータベースに保存します。これが本サービスの中心的な保存データです。
              </p>
            </SubSection>
            <SubSection title="匿名認証">
              <p>
                本サービスが、利用者から氏名・メールアドレス・電話番号などを入力フォームで収集することはありません。本サービスにアクセスした際、匿名ユーザーとして自動的にセッションが作成される場合があり、このとき一意の匿名ユーザーID（技術的な識別子）が生成されます。
              </p>
            </SubSection>
            <SubSection title="アカウント連携（Annict・任意）">
              <p>
                任意で Annict アカウントでログインする場合、Annict
                からログインおよび表示に必要な範囲のプロフィール情報（ユーザー名、表示名、アバター画像など）を取得します。それ以外の追加取得は行いません。取得範囲の詳細は{" "}
                <a
                  href="https://developers.annict.com/docs/rest-api/v1/users#get-v1me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Annict のドキュメント
                </a>
                を参照してください。本サービスではパスワードの保存・管理は一切行いません。
              </p>
              <p className="text-muted-foreground mt-2">
                アカウント連携により、複数デバイス間での投票データの同期や、匿名ユーザーからのデータ引き継ぎが可能になります。
              </p>
            </SubSection>
          </Section>

          <Section title="2. 情報の利用目的">
            <p>前項の情報は、以下の目的に限り利用します。</p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>投票機能の提供</li>
              <li>
                投票結果ページ等における集計の表示（作品ごとの合計コイン数など）
              </li>
              <li>投票履歴の管理・閲覧（マイ投票等）</li>
            </ul>
            <p className="text-muted-foreground mt-3">
              上記以外の目的（広告配信や利用者のプロファイル作成など）には利用しません。
            </p>
          </Section>

          <Section title="3. Cookieの使用">
            <p>本サービスでは、以下の技術を使用しています。</p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>
                <strong>Cookie</strong>
                ：認証セッションの管理に使用します（Supabase
                Authが発行するセッショントークン）。
              </li>
            </ul>
          </Section>

          <Section title="4. 第三者サービスの利用">
            <p>本サービスでは、以下の第三者サービスを利用しています。</p>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>
                <strong>Supabase</strong>
                ：データベース・認証基盤として利用。ユーザーデータはSupabase上に保存されます。
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
                ：ホスティングサービスとして利用。アクセスログ等がVercel上で処理される場合があります。
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
                ：アニメ作品情報の取得に利用します。ログイン時は Annict
                の認証を経由します。プロフィール情報の扱いは{" "}
                <a
                  href="https://developers.annict.com/docs/rest-api/v1/users#get-v1me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Annict のドキュメント
                </a>
                を参照してください。本サービスがデータベースに保存する投票内容や、本サービス内の利用履歴を
                Annict に送信・提供することはありません。
              </li>
            </ul>
          </Section>

          <Section title="5. データの保持">
            <p>
              投票データはユーザーが削除操作を行うまで保持されます（論理削除方式）。
            </p>
          </Section>

          <Section title="6. セキュリティ">
            <p>
              本サービスでは、以下の対策によりユーザーデータの保護に努めています。
            </p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>
                匿名認証およびOAuth認証を採用し、パスワードの保存・管理を行わない設計
              </li>
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
