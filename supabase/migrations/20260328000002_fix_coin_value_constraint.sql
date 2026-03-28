-- Restore the strict coin_value constraint (1-100).
-- First remove old data that violates the constraint, then re-add it.

DELETE FROM coins_prod WHERE coin_value < 1 OR coin_value > 100;
DELETE FROM coins_dev WHERE coin_value < 1 OR coin_value > 100;

ALTER TABLE coins_prod DROP CONSTRAINT IF EXISTS coins_prod_coin_value_check;
ALTER TABLE coins_dev DROP CONSTRAINT IF EXISTS coins_dev_coin_value_check;

ALTER TABLE coins_prod ADD CONSTRAINT coins_prod_coin_value_check CHECK (coin_value BETWEEN 1 AND 100);
ALTER TABLE coins_dev ADD CONSTRAINT coins_dev_coin_value_check CHECK (coin_value BETWEEN 1 AND 100);
