CREATE TABLE IF NOT EXISTS pseudo_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  withdrawn_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE pseudo_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_all" ON pseudo_users
  FOR SELECT USING (true);

ALTER TABLE coins_prod
  ADD COLUMN IF NOT EXISTS pseudo_user_id UUID REFERENCES pseudo_users(id);
CREATE INDEX IF NOT EXISTS idx_coins_prod_pseudo_user_id
  ON coins_prod(pseudo_user_id);

ALTER TABLE coins_dev
  ADD COLUMN IF NOT EXISTS pseudo_user_id UUID REFERENCES pseudo_users(id);
CREATE INDEX IF NOT EXISTS idx_coins_dev_pseudo_user_id
  ON coins_dev(pseudo_user_id);

DROP TABLE IF EXISTS user_withdrawals;
