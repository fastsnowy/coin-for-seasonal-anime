-- Re-sync legacy votes added after the initial import.
-- Applied environments keep their existing migration history; fresh databases
-- without bet_coins have nothing to import. The source data is never modified.
DO $$
BEGIN
  IF pg_catalog.to_regclass('public.bet_coins') IS NOT NULL THEN
    INSERT INTO public.coins_prod (id, annict_id, coin_value, season, created_id, delete_id, user_id, created_at, deleted_at)
    SELECT id, annict_id, coin_value, season, created_id, '', NULL, created_at, deleted_at
    FROM public.bet_coins
    WHERE coin_value BETWEEN 1 AND 100
      AND season ~ '^\d{4}-(spring|summer|autumn|winter)$'
    ON CONFLICT (id) DO NOTHING;
  END IF;
END;
$$;
