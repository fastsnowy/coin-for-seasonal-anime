-- Migrate existing production data from bet_coins to coins_prod.
-- Note: bet_coins does not have a delete_id column, so we use an empty string as default.
-- Rows with coin_value outside 1-100 are excluded to satisfy the check constraint.
-- The old tables (bet_coins, dev_coins) are kept as backup.

INSERT INTO coins_prod (id, annict_id, coin_value, season, created_id, delete_id, user_id, created_at, deleted_at)
SELECT id, annict_id, coin_value, season, created_id, '', NULL, created_at, deleted_at
FROM bet_coins
WHERE coin_value BETWEEN 1 AND 100
ON CONFLICT (id) DO NOTHING;
