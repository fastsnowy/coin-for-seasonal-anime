type TableName = "coins_dev" | "coins_prod";
type ViewName = "public_coins_prod" | "public_coins_dev" | "coin_value_view_dev" | "coin_value_view_prod";

const isVercelProduction = process.env.VERCEL_ENV === "production";

export const DB_TABLES = {
  COINS: (isVercelProduction
    ? "coins_prod"
    : "coins_dev") satisfies TableName,
} as const;

export const DB_VIEWS = {
  PUBLIC_COINS: (isVercelProduction ? "public_coins_prod" : "public_coins_dev") satisfies ViewName,
  COIN_VALUE: (isVercelProduction
    ? "coin_value_view_prod"
    : "coin_value_view_dev") satisfies ViewName,
} as const;
