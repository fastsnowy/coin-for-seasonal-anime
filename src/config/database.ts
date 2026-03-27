type TableName = "dev_coins" | "bet_coins";
type ViewName = "dev_coin_value_view" | "total_coin_value_view";

// Vercel が注入する VERCEL_ENV: production のときだけ本番テーブル。preview / development / 未設定は開発用。
const isVercelProduction = process.env.VERCEL_ENV === "production";

export const DB_TABLES = {
  COINS: (isVercelProduction ? "bet_coins" : "dev_coins") satisfies TableName,
} as const;

export const DB_VIEWS = {
  COIN_VALUE: (isVercelProduction
    ? "total_coin_value_view"
    : "dev_coin_value_view") satisfies ViewName,
} as const;
