# ローカル開発

Node.js 22、pnpm 12.22.0、Docker 互換のコンテナ環境、[Annict の読み取り専用アクセストークン](https://wikino.app/s/annict/pages/355)を用意します。Node.js と pnpm は `mise install` でも揃えられます。

## 1. 依存関係を入れて Supabase を起動する

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

## 2. 環境変数を設定する

プロジェクト直下に `.env.local` を作成します。Supabase の URL と公開キーは、起動時の出力または `pnpm exec supabase status` で確認できます。

```dotenv
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<Supabase の Publishable key または anon key>
ANNICT_TOKEN=<Annict の個人用アクセストークン>
# 任意: 公式サイト画像プロキシ (/api/og-image) の署名鍵。未設定なら ANNICT_TOKEN から派生し、
# どちらも無ければプロセス毎のランダム値になる。本番では複数インスタンスでも URL が一致するよう必ず明示的に設定する (未設定だと ANNICT_TOKEN のローテーションでキャッシュ済みのプロキシ URL が無効になる)。
OG_IMAGE_PROXY_SECRET=<十分に長いランダム文字列>
```

## 3. 開発サーバーを起動する

```bash
pnpm dev
```

[http://localhost:3000](http://localhost:3000) を開くと、作品一覧の閲覧と匿名投票を試せます。Annict アカウント連携を試すには、Supabase にカスタム OAuth プロバイダー `annict` を設定し、`http://localhost:3000/auth/callback` をリダイレクト許可リストに追加します。

動作確認には `pnpm test` と `pnpm typecheck` を使います。既存の Supabase 環境へ変更を反映する手順は[移行ガイド](../SUPABASE_MIGRATION.md)を参照してください。
