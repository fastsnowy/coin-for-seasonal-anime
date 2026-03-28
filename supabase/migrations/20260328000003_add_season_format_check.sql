ALTER TABLE coins_prod
  ADD CONSTRAINT coins_prod_season_format_check
  CHECK (season ~ '^\d{4}-(spring|summer|autumn|winter)$');

ALTER TABLE coins_dev
  ADD CONSTRAINT coins_dev_season_format_check
  CHECK (season ~ '^\d{4}-(spring|summer|autumn|winter)$');
