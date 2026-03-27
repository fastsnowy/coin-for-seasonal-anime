type TableName = "dev_coins" | "bet_coins";
type ViewName = "dev_coin_value_view" | "total_coin_value_view";

const isProduction = process.env.NODE_ENV === "production";

// NEXT_PUBLIC の値で任意のテーブル名が入る設計をやめ、実行環境で固定する。
export const DB_TABLES = {
  COINS: (isProduction ? "bet_coins" : "dev_coins") satisfies TableName,
} as const;

export const DB_VIEWS = {
  COIN_VALUE: (isProduction
    ? "total_coin_value_view"
    : "dev_coin_value_view") satisfies ViewName,
} as const;
