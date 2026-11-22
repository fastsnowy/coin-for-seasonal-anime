import { SiteHeader } from "@/components/site-header";
import { Breadcrumb } from "@/components/breadcrumb";
import { siteName } from "@/config/constant";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `プライバシーポリシー | ${siteName}`,
};

const SECTIONS = [
  { id: "section-1", title: "1. 収集する情報" },
  { id: "section-2", title: "2. 情報の利用目的" },
  { id: "section-3", title: "3. Cookieの使用" },
  { id: "section-4", title: "4. 第三者サービスの利用" },
  { id: "section-5", title: "5. データの保持" },
  { id: "section-6", title: "6. セキュリティ" },
  { id: "section-7", title: "7. ポリシーの変更" },
  { id: "section-8", title: "8. お問い合わせ" },
] as const;

export default function PrivacyPage() {
  return (
    <main className="min-h-dvh bg-background">
      <SiteHeader maxWidth="max-w-4xl" />

      <div className="container mx-auto max-w-2xl px-4 py-6">
        <Breadcrumb items={[{ label: "プライバシーポリシー" }]} />

        <article className="mx-auto mt-4 max-w-[40rem] text-[15px] leading-[1.9] tracking-[0.02em] text-foreground/90 text-pretty sm:mt-6 [&_a]:font-medium [&_a]:text-coin-foreground [&_a]:underline [&_a]:decoration-coin/40 [&_a]:underline-offset-4 [&_a]:transition-colors [&_a:hover]:decoration-coin [&_a]:rounded-sm [&_a]:outline-none [&_a:focus-visible]:ring-[3px] [&_a:focus-visible]:ring-ring/35 [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:mt-3 [&_li]:pl-1 [&_li]:marker:text-muted-foreground/70">
          <header className="border-b border-border pb-6">
            <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-foreground sm:text-3xl">
              プライバシーポリシー
            </h1>
            <p className="mt-2 text-xs tracking-normal text-muted-foreground">
              最終更新日: <time dateTime="2026-03-28">2026年3月28日</time>
            </p>
          </header>

          <nav
            aria-label="目次"
            className="mt-6 rounded-xl border border-border bg-surface-sunken px-4 py-3.5 text-sm"
          >
            <p className="mb-1.5 text-xs font-semibold tracking-wide text-muted-foreground">
              目次
            </p>
            <ol className="grid gap-x-6 sm:grid-cols-2">
              {SECTIONS.map((section) => (
                <li key={section.id} className="pl-0!">
                  <a
                    href={`#${section.id}`}
                    className="inline-flex min-h-9 items-center text-foreground/80! no-underline! hover:text-foreground!"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="mt-8 space-y-4">
            <p className="text-muted-foreground">
              {siteName}
              （旧
              coin-for-seasonal-anime、以下「本サービス」）は、ユーザーのプライバシーを尊重します。本プライバシーポリシーでは、本サービスにおける情報の取り扱いについて説明します。
            </p>
            <p className="rounded-xl border border-coin/20 bg-coin-muted px-4 py-3.5 text-foreground/85">
              <strong className="text-foreground">基本方針</strong>
              ：本サービスは、マーケティングや行動ターゲティングを目的とした個人情報の収集は行いません。保存・利用する情報は、投票機能の提供、投票履歴の表示・管理、および投票結果の集計表示に必要な範囲に限ります。Annict
              アカウントとの連携（ログイン）は任意であり、複数デバイス間での投票データの同期や、匿名利用時からのデータ引き継ぎに利用できます。
            </p>
          </div>

          <Section id="section-1" title="1. 収集する情報">
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
                >
                  Annict のドキュメント
                </a>
                を参照してください。本サービスではパスワードの保存・管理は一切行いません。
              </p>
              <p className="text-muted-foreground">
                アカウント連携により、複数デバイス間での投票データの同期や、匿名ユーザーからのデータ引き継ぎが可能になります。
              </p>
            </SubSection>
          </Section>

          <Section id="section-2" title="2. 情報の利用目的">
            <p>前項の情報は、以下の目的に限り利用します。</p>
            <ul className="list-disc space-y-1.5 pl-5 text-muted-foreground">
              <li>投票機能の提供</li>
              <li>
                投票結果ページ等における集計の表示（作品ごとの合計コイン数など）
              </li>
              <li>投票履歴の管理・閲覧（マイ投票等）</li>
            </ul>
            <p className="text-muted-foreground">
              上記以外の目的（広告配信や利用者のプロファイル作成など）には利用しません。
            </p>
          </Section>

          <Section id="section-3" title="3. Cookieの使用">
            <p>本サービスでは、以下の技術を使用しています。</p>
            <ul className="list-disc space-y-1.5 pl-5 text-muted-foreground">
              <li>
                <strong>Cookie</strong>
                ：認証セッションの管理に使用します（Supabase
                Authが発行するセッショントークン）。
              </li>
            </ul>
          </Section>

          <Section id="section-4" title="4. 第三者サービスの利用">
            <p>本サービスでは、以下の第三者サービスを利用しています。</p>
            <ul className="list-disc space-y-3 pl-5 text-muted-foreground">
              <li>
                <strong>Supabase</strong>
                ：データベース・認証基盤として利用。ユーザーデータはSupabase上に保存されます。
                <br />
                <a
                  href="https://supabase.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
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
                >
                  Annict のドキュメント
                </a>
                を参照してください。本サービスがデータベースに保存する投票内容や、本サービス内の利用履歴を
                Annict に送信・提供することはありません。
              </li>
            </ul>
          </Section>

          <Section id="section-5" title="5. データの保持">
            <p>
              投票データはユーザーが削除操作を行うまで保持されます（論理削除方式）。
            </p>
          </Section>

          <Section id="section-6" title="6. セキュリティ">
            <p>
              本サービスでは、以下の対策によりユーザーデータの保護に努めています。
            </p>
            <ul className="list-disc space-y-1.5 pl-5 text-muted-foreground">
              <li>
                匿名認証およびOAuth認証を採用し、パスワードの保存・管理を行わない設計
              </li>
              <li>データベースへのアクセス制御（Row Level Security）</li>
              <li>通信の暗号化（HTTPS）</li>
              <li>認証トークンの適切な管理</li>
            </ul>
          </Section>

          <Section id="section-7" title="7. ポリシーの変更">
            <p>
              本プライバシーポリシーは、必要に応じて変更される場合があります。重要な変更がある場合は、本ページにて告知します。
            </p>
          </Section>

          <Section id="section-8" title="8. お問い合わせ">
            <p>
              本プライバシーポリシーに関するお問い合わせは、サービスのGitHubリポジトリのIssueにてお願いします。
            </p>
          </Section>

          <p className="mt-12 border-t border-border pt-6 text-xs tracking-normal text-muted-foreground">
            最終更新日: <time dateTime="2026-03-28">2026年3月28日</time>
          </p>
        </article>
      </div>
    </main>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="mt-12 scroll-mt-20"
    >
      <h2
        id={`${id}-heading`}
        className="mb-3 text-lg font-bold leading-snug tracking-tight text-foreground"
      >
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
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
    <div className="mt-5 border-l-2 border-border pl-4">
      <h3 className="mb-1 text-[15px] font-semibold text-foreground">
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
