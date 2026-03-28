CREATE TABLE IF NOT EXISTS user_withdrawals (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  withdrawn_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE user_withdrawals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own" ON user_withdrawals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "insert_own" ON user_withdrawals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "delete_own" ON user_withdrawals
  FOR DELETE USING (auth.uid() = user_id);
