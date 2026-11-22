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
            （旧 coin-for-seasonal-anime。以下「本サービス」）の運営者（以下「運営者」）は、利用者の情報を適切に取り扱うため、本プライバシーポリシー（以下「本ポリシー」）を定めます。本ポリシーでは、本サービスで取得する情報の内容、利用目的、管理方法などを説明します。
          </p>
          <p className="text-muted-foreground mt-4">
            <strong className="text-foreground">基本方針</strong>
            ：本サービスは、広告配信や行動ターゲティングを目的として情報を取得することはありません。取得・保存する情報は、投票機能の提供、投票履歴の表示・管理、投票結果の集計表示、およびサービスの安定運営に必要な範囲に限ります。Annict
            アカウントでのログインは任意です。ログインしなくても本サービスを利用できます。
          </p>

          <Section title="1. 取得する情報">
            <p>本サービスは、以下の情報を取得します。</p>
            <SubSection title="(1) 投票データ">
              <p>
                投票した作品、賭けたコイン数、対象のシーズン、投票日時、投票ごとに発行する識別子、および本サービス内のユーザー識別子をデータベースに保存します。
              </p>
            </SubSection>
            <SubSection title="(2) 匿名ユーザーID">
              <p>
                本サービスに初めてアクセスすると、匿名ユーザーとしてセッションが自動的に作成され、ランダムなユーザーID（技術的な識別子）が発行されます。氏名、メールアドレス、電話番号などを入力していただくことはありません。
              </p>
            </SubSection>
            <SubSection title="(3) Annict アカウントの情報（ログインした場合のみ）">
              <p>
                Annict アカウントでログインした場合、Annict
                から次の情報を受け取り、認証基盤（Supabase
                Auth）に保存します。
              </p>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground mt-2">
                <li>Annict のユーザーID</li>
                <li>ユーザー名、表示名、アバター画像のURL</li>
                <li>
                  Annict に登録されているメールアドレス（アカウントの識別にのみ使用し、本サービスからメールを送信することはありません）
                </li>
              </ul>
              <p className="text-muted-foreground mt-2">
                記録数、フォロー数、プロフィール文など、上記以外の情報は保存しません。Annict
                のパスワードを本サービスが受け取ることはありません。Annict
                が提供する情報の詳細は{" "}
                <a
                  href="https://developers.annict.com/docs/rest-api/v1/users#get-v1me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Annict のドキュメント
                </a>
                をご確認ください。
              </p>
            </SubSection>
            <SubSection title="(4) アクセス解析の情報">
              <p>
                サービス改善のため、Vercel Web Analytics
                を利用して、閲覧したページ、参照元、国・地域、ブラウザ、OS、端末の種類などを取得します。これらは統計として集計され、特定の個人を識別する目的では利用しません。
              </p>
            </SubSection>
            <SubSection title="(5) アクセスログ">
              <p>
                サーバーの運用に伴い、ホスティング事業者や認証基盤の事業者が、IPアドレス、ブラウザの種類（ユーザーエージェント）、アクセス日時などをログとして処理する場合があります。
              </p>
            </SubSection>
          </Section>

          <Section title="2. 利用目的">
            <p>取得した情報は、以下の目的に限り利用します。</p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>投票機能の提供</li>
              <li>
                投票結果ページなどにおける集計の表示（作品ごとの合計コイン数など）
              </li>
              <li>投票履歴の表示・管理（マイ投票など）</li>
              <li>
                ログイン、複数端末間での投票データの同期、匿名利用時からのデータの引き継ぎ
              </li>
              <li>不正利用の防止、障害対応、およびサービスの改善</li>
            </ul>
            <p className="text-muted-foreground mt-3">
              上記以外の目的（広告配信や利用者のプロファイリングなど）には利用しません。
            </p>
          </Section>

          <Section title="3. 公開される情報">
            <p>
              投票結果ページのURLを共有した場合、そのURLを知っている人は誰でも、投票した作品とコイン数を閲覧できます。また、すべての投票は作品ごとの合計コイン数などとして集計され、本サービス上で公開されます。いずれの場合も、ユーザー名やアバター画像など、投票者を特定できる情報は表示されません。
            </p>
          </Section>

          <Section title="4. Cookie などの利用">
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>
                <strong>Cookie</strong>
                ：ログイン状態（匿名ユーザーを含む）を維持するため、Supabase
                Auth が発行するセッション情報を保存します。
              </li>
              <li>
                <strong>ブラウザのローカルストレージ</strong>
                ：ライト／ダークなどの表示テーマの設定を保存します。
              </li>
            </ul>
            <p className="text-muted-foreground mt-3">
              アクセス解析（Vercel Web Analytics）は Cookie
              を使用しません。また、広告目的の Cookie は使用していません。
            </p>
          </Section>

          <Section title="5. 外部サービスの利用と情報の送信先">
            <p>
              本サービスは、以下の外部サービスを利用しており、サービスの提供に必要な範囲でこれらの事業者に情報が送信されます。各事業者のサーバーは日本国外にある場合があります。
            </p>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>
                <strong>Supabase</strong>
                ：データベースおよび認証基盤として利用します。投票データとアカウント情報は
                Supabase 上に保存されます。
                <br />
                <a
                  href="https://supabase.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Supabase プライバシーポリシー
                </a>
              </li>
              <li>
                <strong>Vercel</strong>
                ：ホスティングおよびアクセス解析（Vercel Web
                Analytics）に利用します。
                <br />
                <a
                  href="https://vercel.com/legal/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Vercel プライバシーポリシー
                </a>
              </li>
              <li>
                <strong>Annict</strong>
                ：アニメ作品情報の取得と、ログイン時の認証に利用します。本サービスに保存した投票内容や利用履歴を
                Annict に送信することはありません。
              </li>
            </ul>
          </Section>

          <Section title="6. 第三者への提供">
            <p>
              運営者は、法令に基づく場合を除き、取得した情報を本人の同意なく第三者に提供しません。前項の外部サービスへの送信は、本サービスの運営に必要な業務の委託として行うものです。
            </p>
          </Section>

          <Section title="7. 情報の保存期間と削除">
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>
                <strong>投票データ</strong>
                ：投票の削除操作を行うと、その投票は表示と集計の対象から直ちに外れます。データ自体は削除済みとしてデータベースに残ります。
              </li>
              <li>
                <strong>退会した場合</strong>
                ：Annict
                と連携したアカウントはマイページから退会できます。退会すると、Annict
                から受け取ったアカウント情報（ユーザー名、メールアドレスなど）は削除されます。投票データは集計結果を維持するため、アカウントとの紐付けを解除し、個人を特定できない状態で保持します。
              </li>
            </ul>
          </Section>

          <Section title="8. 安全管理">
            <p>
              運営者は、取得した情報を保護するため、以下の対策を講じています。
            </p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>
                匿名認証と OAuth 認証のみを採用し、パスワードを保存しない設計
              </li>
              <li>
                データベースのアクセス制御（Row Level
                Security）による、本人以外の投票データの閲覧・変更の防止
              </li>
              <li>通信の暗号化（HTTPS）</li>
              <li>依存ライブラリの継続的な更新と脆弱性への対応</li>
            </ul>
          </Section>

          <Section title="9. 本ポリシーの変更">
            <p>
              運営者は、必要に応じて本ポリシーを変更することがあります。重要な変更を行う場合は、本ページでお知らせします。変更後の本ポリシーは、本ページに掲載した時点から効力を生じます。
            </p>
          </Section>

          <Section title="10. お問い合わせ">
            <p>
              本ポリシーに関するお問い合わせは、本サービスの GitHub
              リポジトリの Issue からお願いします。Issue
              は一般に公開されるため、個人情報は書き込まないでください。
            </p>
          </Section>

          <p className="text-xs text-muted-foreground mt-10 pt-6 border-t border-border/50">
            最終更新日: 2026年11月22日
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
