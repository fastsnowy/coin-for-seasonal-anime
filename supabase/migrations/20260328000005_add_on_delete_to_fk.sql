ALTER TABLE coins_prod DROP CONSTRAINT IF EXISTS coins_prod_user_id_fkey;
ALTER TABLE coins_prod
ADD CONSTRAINT coins_prod_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE coins_dev DROP CONSTRAINT IF EXISTS coins_dev_user_id_fkey;
ALTER TABLE coins_dev
ADD CONSTRAINT coins_dev_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;
