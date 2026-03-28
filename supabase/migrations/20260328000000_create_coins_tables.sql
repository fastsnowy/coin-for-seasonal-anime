-- coins_prod table
CREATE TABLE IF NOT EXISTS coins_prod (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  annict_id INTEGER NOT NULL,
  coin_value INTEGER NOT NULL CHECK (coin_value BETWEEN 1 AND 100),
  season TEXT NOT NULL,
  created_id UUID NOT NULL,
  delete_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_coins_prod_created_id ON coins_prod(created_id);
CREATE INDEX IF NOT EXISTS idx_coins_prod_user_id ON coins_prod(user_id);
CREATE INDEX IF NOT EXISTS idx_coins_prod_season ON coins_prod(season);

-- coins_dev table (same schema)
CREATE TABLE IF NOT EXISTS coins_dev (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  annict_id INTEGER NOT NULL,
  coin_value INTEGER NOT NULL CHECK (coin_value BETWEEN 1 AND 100),
  season TEXT NOT NULL,
  created_id UUID NOT NULL,
  delete_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_coins_dev_created_id ON coins_dev(created_id);
CREATE INDEX IF NOT EXISTS idx_coins_dev_user_id ON coins_dev(user_id);
CREATE INDEX IF NOT EXISTS idx_coins_dev_season ON coins_dev(season);

-- Views
CREATE OR REPLACE VIEW coin_value_view_prod AS
SELECT
  annict_id,
  season,
  SUM(coin_value) AS total_coin_value,
  COUNT(DISTINCT created_id) AS uu
FROM coins_prod
WHERE deleted_at IS NULL
GROUP BY annict_id, season;

CREATE OR REPLACE VIEW coin_value_view_dev AS
SELECT
  annict_id,
  season,
  SUM(coin_value) AS total_coin_value,
  COUNT(DISTINCT created_id) AS uu
FROM coins_dev
WHERE deleted_at IS NULL
GROUP BY annict_id, season;

-- RLS
ALTER TABLE coins_prod ENABLE ROW LEVEL SECURITY;
ALTER TABLE coins_dev ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_all" ON coins_prod FOR SELECT USING (true);
CREATE POLICY "select_all" ON coins_dev FOR SELECT USING (true);

CREATE POLICY "insert_own" ON coins_prod FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "insert_own" ON coins_dev FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "update_own" ON coins_prod FOR UPDATE
  USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "update_own" ON coins_dev FOR UPDATE
  USING (auth.uid() = user_id OR user_id IS NULL);
