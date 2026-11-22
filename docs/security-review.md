# セキュリティ確認（2026-10-10）

対象: リポジトリ内の認証、Server Actions、API、DBマイグレーション、依存関係。
稼働中のSupabase/Vercel設定や本番DBには接続していないため、実環境の状態は未確認。

## 修正

1. **高: 所有者なしの投票の不正更新** — `update_own` の `user_id IS NULL` が
   移行済み・退会済み投票を全ユーザーに更新可能にしていた。RLSを本人限定に変更。
2. **高: DB APIから投票内容を改変** — 所有者のUPDATEが全列に及んでいた。
   列権限を `deleted_at` に限定し、INSERT時の日時・退会者IDの偽装も禁止。
3. **中: 公開結果に内部情報を露出** — 全行SELECTと `select("*")` で
   ユーザーID・削除コード・退会者IDも取得・ブラウザに転送していた。
   元テーブルは本人限定とし、公開ビューから投票内容だけを取得。
4. **高: 共有結果への他人の投票追加** — 公開された `created_id` をDB APIから
   INSERTに指定できた。トリガーでグループの所有者・季節・削除状態・重複作品を検証。
   同一IDへの並行INSERTをトランザクションのadvisory lockで直列化。
5. **中: GraphQLインジェクション** — 公開APIのseasonをAnnictトークン付きクエリに
   直接埋め込んでいた。形式検証と文字列のエスケープ、IDの整数・範囲検証を追加。
6. **中: 認証リダイレクト先の汚染** — クライアントのOrigin/転送ヘッダーを
   OAuthの戻り先に使っていた。信頼する環境変数から構築。
   内部パスでもタブ・改行で `//` に変わるケースを拒否。
7. **既知の依存脆弱性** — Next.js 16.4.0、React/React DOM 19.3.0、Hono 4.13.13
   へ更新し、互換範囲内の依存更新で間接依存の修正版も反映。
   古い `@vercel/og` は `next/og` に統一して削除。
   Next.jsの[公式アドバイザリ](https://github.com/vercel/next.js/security/advisories/GHSA-h25m-26qc-wcjf)
   にあるRSCのDoSについて旧16.1.1は影響範囲内。

追加: iframe埋め込み、MIME sniffingを防ぐレスポンスヘッダー。
Annictユーザー情報のレスポンス・上流通信をキャッシュ禁止とし、
リダイレクト経由の認証ヘッダー転送を防止。上流エラー本文のログ出力も削除。

## 検証と残存事項

- 回帰テスト6件（本番・開発テーブルのDB権限テストを含む）、TypeScript、本番ビルドが成功。
- マイグレーション前後で投票（削除済みを含む）、退会者、旧バックアップの全行・全列が同一であることを検証。
- DBテストはPGliteでPostgreSQLを実行。匿名ユーザーの元テーブル参照禁止、
  別ユーザー・所有者なし投票の更新禁止、所有者による削除、列権限、
  グループへの不正追加、公開ビューの情報制限、集計を検証。
- `pnpm audit` の残存検出は開発依存 `braces` のHigh 1件のみ。
  [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) は
  深くネストしたパターンによるスタック枯渇で、監査時点で修正版なし。
  `eslint-config-next > @next/eslint-plugin-next > fast-glob > micromatch` の経路であり、
  アプリはこのライブラリにHTTP入力を渡していない。監査結果は抑制していない。
- 全体のlintには既存のReact refs、effect内のsetState、Edge Functionの
  `@ts-nocheck` によるエラーが残る。今回変更したファイルのlintは別途確認。
- 秘密鍵・代表的なアクセストークン形式の作業ツリー検査で一致なし。
  Git履歴全体の秘密情報監査は実施していない。
- 本番へのDBマイグレーション適用とAPP_URL設定は
  [適用手順](../SUPABASE_MIGRATION.md#7-セキュリティ修正の適用2026-10-10) に記載。

# 依存更新・リファクタリング（2026-11-22）

## 依存関係

- `pnpm audit` で検出された17件（Critical 2 / High 2 / Moderate 12 / Low 1）を解消し、0件に。
  - Next.js 16.4.0 → 16.4.6（画像最適化API・`use cache` のRCE、Server ActionsのDoS ほか）
  - React / React DOM 19.3.0 → 19.3.1、eslint-config-next 16.4.6
  - Zod 3 → 4.6.7（巨大コレクション検証時のメモリ枯渇）。間接依存も overrides で固定
  - `minimatch`（開発依存経由のReDoS）を overrides で 11.0.1 以上に固定
- 未使用の依存（Hono、`@conform-to/*`、`uuid`、`react-number-format`、`supazod`）を削除。
- Biome・Supabase CLI・型定義を devDependencies へ移動し、本番依存を最小化。
- pnpm 12 では `package.json` の `pnpm.overrides` が読まれないため `pnpm-workspace.yaml` へ移行。
  - `allowBuilds` でインストールスクリプトの実行を esbuild のみに限定。
  - `minimumReleaseAge: 1440` で公開から1日未満のバージョンを解決しない（サプライチェーン対策）。

## コード

1. **未使用の公開APIを削除** — `/api/[[...route]]`（Hono）はアプリから参照されていないのに、
   サーバーの `ANNICT_TOKEN` で Annict へ問い合わせる未認証エンドポイントと、
   外部JSONをそのまま返すエンドポイントを公開していた。
2. **外部URLの検証** — Annict から受け取る公式サイトURL・画像URLを http(s) に限定し、
   X のユーザー名も形式検証。CSS `url()` への埋め込みは引用符付きに変更。
3. **Annict取得処理の共通化** — 重複していた取得処理を `server-only` モジュールに集約し、
   トークン未設定の検知、タイムアウト、リダイレクト禁止、レスポンス形式の検証を追加。
4. **認証リダイレクト** — `/auth/callback`・`/auth/confirm` のリダイレクト先を
   リクエストの Host ではなく設定済みオリジン（`APP_URL`）から構築。
   `/auth/confirm` は `next` の検証と OTP 種別の許可リスト検証を追加。
   OAuth プロバイダーのエラー文言をURLへ反映しないよう固定コードに変更。
5. **投票削除** — `created_id` をUUIDとして検証し、取得時も `user_id` で絞り込み。
   エラーログはエラーコードのみに縮小。

## 検証

- `pnpm test`（11件）、`pnpm typecheck`、`pnpm build`、`pnpm audit` が成功。
- pnpm 10 でも `--frozen-lockfile` でインストールできることを確認。
- 全体の lint に残るエラーは既存のもの（今回の変更ファイルはエラーなし）。
