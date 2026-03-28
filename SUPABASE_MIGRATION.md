# Supabase Migration Guide

このプロジェクトで Supabase マイグレーションを進めるための実行手順です。  
今回追加した `user_withdrawals` のマイグレーションにもそのまま使えます。

## 前提

- `supabase` CLI が使えること（`.mise.toml` で管理済み）
- プロジェクトルートで作業すること
- ローカル検証では Docker が起動していること

## 1. 追加済みマイグレーションの確認

今回追加済み:

- `supabase/migrations/20260328000004_create_user_withdrawals.sql`

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

- `user_withdrawals` テーブルが作成されている
- RLS が有効化されている
- `select_own` / `insert_own` / `delete_own` ポリシーが存在する
- `src/lib/schema.ts` に `user_withdrawals` 型が含まれている

## 6. 実装と整合する挙動

- 退会時: `user_withdrawals` に `user_id` を記録し、`signOut`
- 再登録時: OAuth callback 成功後に `user_withdrawals` レコードを削除して復元扱い
- 投票データ (`coins`) は更新しない
