import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { test } from "node:test";
import { PGlite } from "@electric-sql/pglite";

const directory = new URL("../supabase/migrations/", import.meta.url);
async function setup(db: PGlite) {
  await db.exec(`
    CREATE ROLE anon; CREATE ROLE authenticated;
    CREATE SCHEMA auth;
    CREATE TABLE auth.users (id uuid PRIMARY KEY);
    CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS
      $$ SELECT NULLIF(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    GRANT USAGE ON SCHEMA auth TO anon, authenticated;
    GRANT EXECUTE ON FUNCTION auth.uid() TO anon, authenticated;
  `);
}

test("all migrations bootstrap a fresh database without legacy tables", async () => {
  const db = new PGlite();
  try {
    await setup(db);
    for (const file of (await readdir(directory)).filter((file) => file.endsWith(".sql")).sort()) {
      await db.exec(await readFile(new URL(file, directory), "utf8"));
    }
    assert.equal((await db.query("SELECT * FROM coins_prod")).rows.length, 0);
    assert.equal((await db.query("SELECT * FROM coins_dev")).rows.length, 0);
    await db.exec("SET ROLE anon");
    assert.equal((await db.query("SELECT * FROM public_coins_prod")).rows.length, 0);
  } finally {
    await db.close();
  }
});

test("legacy import preserves source data and remains idempotent", async () => {
  const db = new PGlite();
  try {
    await setup(db);
    await db.exec(await readFile(new URL("20260328000000_create_coins_tables.sql", directory), "utf8"));
    await db.exec(`CREATE TABLE bet_coins (LIKE coins_prod INCLUDING DEFAULTS);
      ALTER TABLE bet_coins DROP COLUMN delete_id;
      INSERT INTO bet_coins (annict_id,coin_value,season,created_id)
        VALUES (1,10,'2026-autumn',gen_random_uuid()), (2,101,'2026-autumn',gen_random_uuid());`);
    const source = await db.query("SELECT * FROM bet_coins ORDER BY annict_id");
    const migration = await readFile(new URL("20260328000001_migrate_existing_data.sql", directory), "utf8");
    await db.exec(migration);
    await db.exec(migration);
    const resync = await readFile(new URL("20260328000007_resync_bet_coins_to_coins_prod.sql", directory), "utf8");
    await db.exec(resync);
    await db.exec(resync);
    assert.deepEqual((await db.query("SELECT * FROM bet_coins ORDER BY annict_id")).rows, source.rows);
    const imported = await db.query<{ id: string; coin_value: number; delete_id: string }>("SELECT id,coin_value,delete_id FROM coins_prod");
    assert.equal(imported.rows.length, 1);
    assert.equal(imported.rows[0].coin_value, 10);
    assert.equal(imported.rows[0].delete_id, "");
    assert.equal(imported.rows[0].id, (source.rows[0] as { id: string }).id);
  } finally {
    await db.close();
  }
});
