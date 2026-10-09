# Supabase Migration Guide

このプロジェクトで Supabase マイグレーションを進めるための実行手順です。  
今回追加した `pseudo_users` と `coins` 拡張のマイグレーションにもそのまま使えます。

## 前提

- `supabase` CLI が使えること（`.mise.toml` で管理済み）
- プロジェクトルートで作業すること
- ローカル検証では Docker が起動していること

## 1. 追加済みマイグレーションの確認

今回追加済み:

- `supabase/migrations/20260328000005_add_on_delete_to_fk.sql`
- `supabase/migrations/20260328000006_create_pseudo_users.sql`

必要に応じて未適用のマイグレーション一覧を確認します。

```bash
pnpm dlx supabase migration list
```

## 2. ローカル DB に適用して確認

ローカル Supabase を起動してマイグレーションを適用します。

```bash
pnpm dlx supabase start
pnpm dlx supabase db reset
```

`db reset` はローカルDBの既存データを削除して、マイグレーションを先頭から再適用します。
破棄してよいローカル検証環境だけで使用してください。本番・保存が必要なDBでは実行しないでください。

## 3. 型定義を再生成

ローカル DB 状態から `src/lib/schema.ts` を再生成します。

```bash
mise run gen-schema-local
```

補足:

- リンク済みプロジェクト（remote）から生成したい場合は `mise run gen-schema` を使用

## 4. リモート環境へ反映

対象 Supabase プロジェクトにログイン・リンク済みであることを確認し、差分を反映します。

```bash
pnpm dlx supabase db push
```

必要に応じて適用後に型を再生成します。

```bash
mise run gen-schema
```

## 5. 確認ポイント（今回の変更）

- `coins_prod` / `coins_dev` の `user_id` FK が `ON DELETE SET NULL` になっている
- `pseudo_users` テーブルが作成されている
- `coins_prod` / `coins_dev` に `pseudo_user_id` カラムが追加されている
- `src/lib/schema.ts` に `pseudo_users` と `pseudo_user_id` が含まれている

## 6. 実装と整合する挙動

- 退会時: Edge Function が `pseudo_users` を作成し、対象ユーザーの `coins` を `pseudo_user_id` にマッピング
- その後 `auth.admin.deleteUser()` により `user_id` は `NULL` になる
- 投票データは匿名のまま保持され、同一退会者の投票は `pseudo_user_id` で追跡可能

## 7. セキュリティ修正の適用（2026-10-10）

今回の `20261010000000_harden_vote_access.sql` は、既存行のDELETE、UPDATE、
TRUNCATE、テーブル/列のDROPを行いません。投票・退会者・旧バックアップの
行数と全列の値が適用前後で同一であることを回帰テストで検証しています。
権限変更で元テーブルから見えなくなるデータはありますが、削除はされません。
SQL全体をトランザクション内で実行するため、失敗時は権限・ビュー変更もロールバックします。

本番適用は、対象プロジェクトと未適用SQLを確認してから行ってください。

```bash
pnpm dlx supabase migration list
pnpm dlx supabase db push --dry-run
# 未適用SQLを確認した後
pnpm dlx supabase db push
```

`db push` は今回の1ファイルだけでなく、未適用のマイグレーションを適用します。
古い `20260328000002_fix_coin_value_constraint.sql` には範囲外のコインを持つ行を
DELETEする処理があるため、そのファイルも未適用ならデータが削除される可能性があります。
本番に `db reset` は実行しないでください。

`20261010000000_harden_vote_access.sql` を **アプリのデプロイ前に** 適用してください。
結果ページは新しい `public_coins_prod` / `public_coins_dev` ビューを使用します。
旧バージョンのアプリは適用後、他人の結果を元テーブルから読めなくなるため、
DB適用とアプリのデプロイを同じメンテナンス時間内で行ってください。

- 元テーブルのSELECT/UPDATEは本人のみ。所有者がNULLの移行済み・退会済み投票は更新不可。
- INSERT可能な列を限定し、UPDATEは `deleted_at` のみ許可。
- 公開ビューは未削除の投票内容4列のみ。ユーザーID、削除コード、退会者IDは公開しない。
- 集計ビューは従来通り全員の未削除投票を集計する。
- 公開済みの結果IDに別ユーザーが投票を追加する操作、同一結果への重複作品追加をDBで拒否。
- `pseudo_users` と旧バックアップテーブルは一般クライアントからアクセス不可。
- 退会処理のservice roleによる更新と、匿名ログイン済みユーザーの投票は維持。

OAuth用の `APP_URL` をデプロイ環境に設定してください（例: `https://your-domain.example`）。
未設定時は `VERCEL_PROJECT_PRODUCTION_URL`、開発環境のみ `http://localhost:3000` を使います。
プレビューや独自ドメインでは、その環境で実際に利用するURLを `APP_URL` に明示し、
Supabaseのリダイレクト許可リストにも `/auth/callback` を登録してください。
リクエストのOriginや転送ヘッダーは認証の戻り先として使用しません。

回帰テストは `pnpm test`。PGliteのPostgreSQLで匿名・所有者・別ユーザーの
直接DBアクセスを検証します。本番Supabaseへの適用・設定確認は別途必要です。
