import assert from "node:assert/strict";
import { test } from "node:test";
import { GET_ANIME_DETAILS, GET_ANIME_DETAILS_BY_IDS } from "../src/gql/index";
import { sanitizeNextPath, redirectUrlWithAuthToast } from "../src/lib/auth-redirect";
import { getSiteOrigin } from "../src/lib/site-origin";
import { toAnime, toAnimeList, PLACEHOLDER_IMAGE } from "../src/lib/annict-works";
import { toCssUrl, toSafeHttpUrl, toSafeTwitterUsername } from "../src/lib/safe-url";
import { createVoteInputSchema, voteGroupIdSchema } from "../src/lib/vote-input";

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

test("external URLs from Annict are limited to http(s)", () => {
  assert.equal(toSafeHttpUrl("https://example.com/a?b=1"), "https://example.com/a?b=1");
  for (const url of ["javascript:alert(1)", "data:text/html,x", "https://user:pass@example.com", "/relative", "", null, 1]) {
    assert.equal(toSafeHttpUrl(url), undefined);
  }
  assert.equal(toSafeTwitterUsername("@anime_PR"), "anime_PR");
  for (const name of ["../intent", "a/b", "x".repeat(16), "?a=1"]) {
    assert.equal(toSafeTwitterUsername(name), undefined);
  }
  assert.equal(toCssUrl('https://example.com/a.png") ; background:red'), 'url("https://example.com/a.png%22)%20;%20background:red")');
  assert.equal(toCssUrl("/placeholder.svg?w=300"), 'url("/placeholder.svg?w=300")');
  assert.equal(toCssUrl("javascript:alert(1)"), undefined);
});

test("Annict works are normalized before reaching the UI", () => {
  const anime = toAnime({
    __typename: "Work",
    annictId: 1,
    title: "t",
    officialSiteUrl: "javascript:alert(1)",
    twitterUsername: "bad/name",
    watchersCount: 3,
    media: "TV",
    image: { __typename: "WorkImage", facebookOgImageUrl: "javascript:x", recommendedImageUrl: "https://img.example/a.png" },
  });
  assert.deepEqual(anime, {
    id: 1, title: "t", media: "TV", watchersCount: 3,
    officialSiteUrl: undefined, twitterUrl: undefined, image: "https://img.example/a.png",
  });
  assert.equal(toAnimeList([{ annictId: -1 }, null, { annictId: 2 }])[0].image, PLACEHOLDER_IMAGE);
  assert.deepEqual(toAnimeList(undefined), []);
});

test("vote deletion only accepts UUID group IDs", () => {
  assert.equal(voteGroupIdSchema.safeParse(crypto.randomUUID()).success, true);
  for (const id of ["", "abc", "00000000-0000-0000-0000-000000000000' OR 1=1", 1, null]) {
    assert.equal(voteGroupIdSchema.safeParse(id).success, false);
  }
});
