BEGIN;

-- Public results expose only vote contents, never ownership/deletion metadata.
-- These deliberately use the owner's permissions to include legacy/withdrawn votes.
CREATE OR REPLACE VIEW public.public_coins_prod WITH (security_barrier = true) AS
SELECT created_id, annict_id, coin_value, season FROM public.coins_prod
WHERE deleted_at IS NULL;
CREATE OR REPLACE VIEW public.public_coins_dev WITH (security_barrier = true) AS
SELECT created_id, annict_id, coin_value, season FROM public.coins_dev
WHERE deleted_at IS NULL;
REVOKE ALL ON public.public_coins_prod, public.public_coins_dev FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.public_coins_prod, public.public_coins_dev TO anon, authenticated;

REVOKE ALL ON public.coin_value_view_prod, public.coin_value_view_dev FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.coin_value_view_prod, public.coin_value_view_dev TO anon, authenticated;

DROP POLICY "select_all" ON public.coins_prod;
DROP POLICY "select_all" ON public.coins_dev;
CREATE POLICY "select_own" ON public.coins_prod FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id);
CREATE POLICY "select_own" ON public.coins_dev FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id);
DROP POLICY "update_own" ON public.coins_prod;
DROP POLICY "update_own" ON public.coins_dev;
CREATE POLICY "update_own" ON public.coins_prod FOR UPDATE TO authenticated
USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE POLICY "update_own" ON public.coins_dev FOR UPDATE TO authenticated
USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);

-- RLS alone does not prevent owners from rewriting coin totals or metadata.
REVOKE ALL ON public.coins_prod, public.coins_dev FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.coins_prod, public.coins_dev TO authenticated;
GRANT INSERT (annict_id, coin_value, season, created_id, delete_id, user_id)
ON public.coins_prod, public.coins_dev TO authenticated;
GRANT UPDATE (deleted_at) ON public.coins_prod, public.coins_dev TO authenticated;

DROP POLICY "select_all" ON public.pseudo_users;
REVOKE ALL ON public.pseudo_users FROM PUBLIC, anon, authenticated;

-- Do not permit attaching new rows to someone else's publicly shared result ID.
CREATE FUNCTION public.check_vote_group() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE invalid_group boolean;
BEGIN
  PERFORM pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(TG_TABLE_NAME || NEW.created_id::text, 0));
  EXECUTE pg_catalog.format(
    'SELECT EXISTS (SELECT 1 FROM public.%I WHERE created_id = $1 AND (user_id IS DISTINCT FROM $2 OR season IS DISTINCT FROM $3 OR deleted_at IS NOT NULL OR annict_id = $4))',
    TG_TABLE_NAME)
  INTO invalid_group USING NEW.created_id, NEW.user_id, NEW.season, NEW.annict_id;
  IF invalid_group THEN
    RAISE EXCEPTION 'Invalid vote group' USING ERRCODE = '23514';
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.check_vote_group() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER check_vote_group BEFORE INSERT ON public.coins_prod FOR EACH ROW EXECUTE FUNCTION public.check_vote_group();
CREATE TRIGGER check_vote_group BEFORE INSERT ON public.coins_dev FOR EACH ROW EXECUTE FUNCTION public.check_vote_group();

-- Migration backups must not remain exposed by the REST API.
DO $$
DECLARE table_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY['bet_coins', 'dev_coins'] LOOP
    IF pg_catalog.to_regclass('public.' || table_name) IS NOT NULL THEN
      EXECUTE pg_catalog.format('REVOKE ALL ON public.%I FROM PUBLIC, anon, authenticated', table_name);
    END IF;
  END LOOP;
END;
$$;

COMMIT;
