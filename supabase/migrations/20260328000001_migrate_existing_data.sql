-- Import legacy production votes when upgrading an existing database.
-- Fresh local databases have no bet_coins table and need no legacy import.
-- Keep the source table unchanged; only valid coin values are copied.
DO $$
BEGIN
  IF pg_catalog.to_regclass('public.bet_coins') IS NOT NULL THEN
    INSERT INTO public.coins_prod (id, annict_id, coin_value, season, created_id, delete_id, user_id, created_at, deleted_at)
    SELECT id, annict_id, coin_value, season, created_id, '', NULL, created_at, deleted_at
    FROM public.bet_coins
    WHERE coin_value BETWEEN 1 AND 100
    ON CONFLICT (id) DO NOTHING;
  END IF;
END;
$$;
