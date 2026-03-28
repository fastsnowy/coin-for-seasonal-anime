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

`db reset` は `supabase/migrations/` を先頭から再適用するため、今回の SQL も含めて反映されます。

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
