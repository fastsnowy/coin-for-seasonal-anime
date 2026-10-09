import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { PGlite } from "@electric-sql/pglite";

const owner = "11111111-1111-4111-8111-111111111111";
const other = "22222222-2222-4222-8222-222222222222";
const group = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const legacy = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";

for (const table of ["coins_prod", "coins_dev"]) {
  test(`${table}: enforce permissions through direct database access`, async () => {
    const db = new PGlite();
    try {
      await db.exec(`
        CREATE ROLE anon; CREATE ROLE authenticated;
        CREATE SCHEMA auth;
        CREATE TABLE auth.users (id uuid PRIMARY KEY);
        CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS
          $$ SELECT NULLIF(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
        GRANT USAGE ON SCHEMA auth TO anon, authenticated;
        GRANT EXECUTE ON FUNCTION auth.uid() TO anon, authenticated;
        INSERT INTO auth.users VALUES ('${owner}'), ('${other}');
        CREATE TABLE bet_coins (id uuid); CREATE TABLE dev_coins (id uuid);
        GRANT ALL ON bet_coins, dev_coins TO anon, authenticated;
      `);
      for (const file of ["20260328000000_create_coins_tables.sql", "20260328000005_add_on_delete_to_fk.sql", "20260328000006_create_pseudo_users.sql"]) {
        await db.exec(await readFile(new URL(`../supabase/migrations/${file}`, import.meta.url), "utf8"));
      }
      await db.exec(`INSERT INTO ${table} (annict_id, coin_value, season, created_id, delete_id, user_id)
        VALUES (1, 10, '2026-autumn', '${group}', 'secret', '${owner}'),
               (2, 20, '2026-autumn', '${legacy}', 'old-secret', NULL);
        INSERT INTO pseudo_users (id) VALUES ('${other}');
        UPDATE ${table} SET pseudo_user_id='${other}' WHERE created_id='${legacy}';
        INSERT INTO ${table} (annict_id,coin_value,season,created_id,delete_id,deleted_at)
          VALUES (9,9,'2026-autumn',gen_random_uuid(),'deleted-secret',now());
        INSERT INTO bet_coins VALUES ('${group}'); INSERT INTO dev_coins VALUES ('${legacy}');`);
      const snapshotSql = `SELECT jsonb_build_object(
        'prod', (SELECT jsonb_agg(t ORDER BY id) FROM coins_prod t),
        'dev', (SELECT jsonb_agg(t ORDER BY id) FROM coins_dev t),
        'pseudo', (SELECT jsonb_agg(t ORDER BY id) FROM pseudo_users t),
        'backup_prod', (SELECT jsonb_agg(t ORDER BY id) FROM bet_coins t),
        'backup_dev', (SELECT jsonb_agg(t ORDER BY id) FROM dev_coins t)
      ) AS snapshot`;
      const before = await db.query(snapshotSql);
      await db.exec(await readFile(new URL('../supabase/migrations/20261010000000_harden_vote_access.sql', import.meta.url), 'utf8'));
      assert.deepEqual((await db.query(snapshotSql)).rows, before.rows, 'Migration preserves all existing rows and values');
      await db.exec('SET ROLE anon;');
      await assert.rejects(db.query(`SELECT * FROM ${table}`), /permission denied/);
      await assert.rejects(db.query("SELECT * FROM pseudo_users"), /permission denied/);
      await assert.rejects(db.query("SELECT * FROM bet_coins"), /permission denied/);
      const publicRows = await db.query<Record<string, unknown>>(`SELECT * FROM public_${table}`);
      assert.equal(publicRows.rows.length, 2);
      assert.deepEqual(Object.keys(publicRows.rows[0]).sort(), ["annict_id", "coin_value", "created_id", "season"]);
      assert.equal((await db.query(`SELECT * FROM coin_value_view_${table === 'coins_prod' ? 'prod' : 'dev'}`)).rows.length, 2);
      await db.exec(`SET ROLE authenticated; SELECT set_config('request.jwt.claim.sub', '${other}', false);`);
      assert.equal((await db.query(`SELECT * FROM ${table}`)).rows.length, 0);
      assert.equal((await db.query(`UPDATE ${table} SET deleted_at=now() RETURNING id`)).rows.length, 0);
      await assert.rejects(db.exec(`INSERT INTO ${table} (annict_id,coin_value,season,created_id,delete_id,user_id)
        VALUES (3,10,'2026-autumn','${group}','x','${other}')`), /Invalid vote group/);
      await assert.rejects(db.exec(`INSERT INTO ${table} (annict_id,coin_value,season,created_id,delete_id,user_id)
        VALUES (3,10,'2026-autumn','${legacy}','x','${other}')`), /Invalid vote group/);
      await assert.rejects(db.exec(`INSERT INTO ${table} (annict_id,coin_value,season,created_id,delete_id,user_id)
        VALUES (3,10,'2026-autumn',gen_random_uuid(),'x','${owner}')`), /row-level security/);
      await db.exec(`SELECT set_config('request.jwt.claim.sub', '${owner}', false);`);
      assert.equal((await db.query(`SELECT * FROM ${table}`)).rows.length, 1);
      for (const assignment of ["coin_value=100", `user_id='${other}'`, "pseudo_user_id=gen_random_uuid()", "created_at=now()"]) {
        await assert.rejects(db.exec(`UPDATE ${table} SET ${assignment}`), /permission denied/);
      }
      await assert.rejects(db.exec(`INSERT INTO ${table} (annict_id,coin_value,season,created_id,delete_id,user_id)
        VALUES (1,10,'2026-autumn','${group}','x','${owner}')`), /Invalid vote group/);
      await db.exec(`INSERT INTO ${table} (annict_id,coin_value,season,created_id,delete_id,user_id)
        VALUES (3,30,'2026-autumn','${group}','x','${owner}');`);
      assert.equal((await db.query(`UPDATE ${table} SET deleted_at=now() WHERE created_id='${group}' RETURNING id`)).rows.length, 2);
      assert.equal((await db.query<Record<string, unknown>>(`SELECT * FROM public_${table}`)).rows.length, 1);
      assert.equal((await db.query(`SELECT total_coin_value FROM coin_value_view_${table === 'coins_prod' ? 'prod' : 'dev'}`)).rows.length, 1);
      await assert.rejects(db.exec(`DELETE FROM ${table}`), /permission denied/);
    } finally {
      await db.close();
    }
  });
}
