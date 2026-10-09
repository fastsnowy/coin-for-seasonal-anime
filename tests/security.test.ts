import assert from "node:assert/strict";
import { test } from "node:test";
import { GET_ANIME_DETAILS, GET_ANIME_DETAILS_BY_IDS } from "../src/gql/index";
import { sanitizeNextPath, redirectUrlWithAuthToast } from "../src/lib/auth-redirect";
import { getSiteOrigin } from "../src/lib/site-origin";
import { createVoteInputSchema } from "../src/lib/vote-input";

test("GraphQL builders reject injected strings and invalid IDs", () => {
  assert.match(GET_ANIME_DETAILS("2026-autumn").query, /seasons: \["2026-autumn"\]/);
  for (const season of ['2026-autumn"]){ __typename } #', "", "2026-autumn\n"]) {
    assert.throws(() => GET_ANIME_DETAILS(season));
  }
  for (const ids of [["1]){__typename}"], [NaN], [1.5], [-1], [2147483648], Array(501).fill(1)]) {
    assert.throws(() => GET_ANIME_DETAILS_BY_IDS(ids as number[]));
  }
  assert.match(GET_ANIME_DETAILS_BY_IDS([1, 2]).query, /annictIds: \[1,2\]/);
});

test("OAuth next paths stay on the same origin", () => {
  for (const path of ["https://evil.example", "//evil.example", "/\\evil.example", "/%5cevil.example", "/%2fevil.example", "/\t/evil.example", "/\n/evil.example", "/%0a/evil.example", "/%zz"]) {
    assert.equal(sanitizeNextPath(path), "/");
    assert.equal(new URL(redirectUrlWithAuthToast("https://app.example", path)).origin, "https://app.example");
  }
  assert.equal(sanitizeNextPath("/my-votes?tab=1"), "/my-votes?tab=1");
});

test("OAuth callback origin uses deployment configuration", () => {
  const saved = { ...process.env };
  try {
    process.env = { ...process.env, NODE_ENV: "production" };
    process.env.APP_URL = "https://app.example/";
    assert.equal(getSiteOrigin(), "https://app.example");
    process.env.APP_URL = "http://evil.example";
    assert.throws(getSiteOrigin);
    delete process.env.APP_URL;
    delete process.env.VERCEL_PROJECT_PRODUCTION_URL;
    assert.throws(getSiteOrigin);
  } finally {
    process.env = saved;
  }
});

test("vote input bounds payloads and rejects duplicate anime IDs", () => {
  const item = { annict_id: 1, coin_value: 100 };
  const input = { seasonName: "2026-autumn", betAnimes: [item] };
  assert.equal(createVoteInputSchema.safeParse(input).success, true);
  for (const betAnimes of [[], [item, item], Array(501).fill(item), [{ ...item, coin_value: 101 }]]) {
    assert.equal(createVoteInputSchema.safeParse({ ...input, betAnimes }).success, false);
  }
});
