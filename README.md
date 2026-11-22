# <img src="https://coin-for-seasonal-anime.vercel.app/icon" alt="" width="28" height="28"> Anicoy

[![Anicoy を開く](https://img.shields.io/badge/Anicoy-%E3%82%B5%E3%82%A4%E3%83%88%E3%82%92%E9%96%8B%E3%81%8F-7C3AED?style=flat-square)](https://coin-for-seasonal-anime.vercel.app/)
![Next.js 16](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![TypeScript 5](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=flat-square&logo=supabase&logoColor=white)
![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)

Anicoy（旧 coin-for-seasonal-anime）は、シーズンごとに気になるアニメへコインを配分し、期待度を投票する Web アプリです。作品ごとに集まったコイン数は、シーズン別のランキングで確認できます。

## 使い方

1. トップページから今期または来期を選び、作品一覧を開きます。
2. 投票したい作品にそれぞれ 1〜100 枚のコインを設定します。
3. 「投票確定」で内容を確認し、「投票する」を押します。
4. 結果ページの「URLをコピー」または「Xでシェア」から投票結果を共有できます。

アカウント登録なしで投票できます。メニューの「投票履歴」で過去の投票を確認でき、Annict アカウントを連携すると別の端末でも履歴を引き継げます。

## 技術構成

| 技術 | 用途 |
| --- | --- |
| Next.js 16（App Router）、React 19、TypeScript | 画面表示、サーバー処理 |
| Tailwind CSS 4、Radix UI、Jotai | スタイル、UI コンポーネント、投票入力の状態管理 |
| Supabase（PostgreSQL / Auth） | 投票の保存・集計、匿名ログイン、Annict アカウント連携 |
| Annict GraphQL API | シーズン別の作品情報の取得 |
| Vercel | Web アプリのホスティング |

## Quickstart

Node.js 22、pnpm 12.22.0、Docker 互換のコンテナ環境、[Annict の読み取り専用アクセストークン](https://wikino.app/s/annict/pages/355)を用意します。Node.js と pnpm は `mise install` でも揃えられます。

### 1. 依存関係を入れて Supabase を起動する

```bash
git clone https://github.com/fastsnowy/coin-for-seasonal-anime.git
cd coin-for-seasonal-anime
pnpm install --frozen-lockfile
```

Discord と Google の OAuth 資格情報を用意せずにローカルで匿名投票を試す場合は、`supabase/config.toml` の `[auth.external.discord]` と `[auth.external.google]` をそれぞれ `enabled = false` にできます。

```bash
pnpm exec supabase start
```

初回起動時に `supabase/migrations/` の SQL が適用されます。[Supabase のローカル開発ガイド](https://supabase.com/docs/guides/local-development/cli/getting-started)

### 2. 環境変数を設定する

プロジェクト直下に `.env.local` を作成します。Supabase の URL と公開キーは、起動時の出力または `pnpm exec supabase status` で確認できます。

```dotenv
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<Supabase の Publishable key または anon key>
ANNICT_TOKEN=<Annict の個人用アクセストークン>
```

### 3. 開発サーバーを起動する

```bash
pnpm dev
```

[http://localhost:3000](http://localhost:3000) を開くと、作品一覧の閲覧と匿名投票を試せます。Annict アカウント連携を試すには、Supabase にカスタム OAuth プロバイダー `annict` を設定し、`http://localhost:3000/auth/callback` をリダイレクト許可リストに追加します。

動作確認には `pnpm test` と `pnpm typecheck` を使います。既存の Supabase 環境へ変更を反映する手順は[移行ガイド](./SUPABASE_MIGRATION.md)を参照してください。
