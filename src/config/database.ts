
type TableName = "dev_coins" | "bet_coins";
type ViewName = "dev_coin_value_view" | "total_coin_value_view";

export const DB_TABLES = {
  COINS: (process.env.NEXT_PUBLIC_DB_COINS_TABLE || "dev_coins") as TableName,
} as const;

export const DB_VIEWS = {
  COIN_VALUE: (process.env.NEXT_PUBLIC_DB_COIN_VALUE_VIEW || "dev_coin_value_view") as ViewName,
} as const;
