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

test("OGP image extraction handles real-world meta variations", async () => {
  const { extractOgImageUrl, isPrivateAddress } = await import("../src/lib/og-image");
  const page = "https://example.jp/anime/top/";
  assert.equal(extractOgImageUrl(`<meta property="og:image" content="https://cdn.example/a.jpg">`, page), "https://cdn.example/a.jpg");
  assert.equal(extractOgImageUrl(`<meta content='/img/ogp.png' property='og:image'>`, page), "https://example.jp/img/ogp.png");
  assert.equal(extractOgImageUrl(`<meta name="og:image" content="//cdn.example/b.png?a=1&amp;b=2" />`, page), "https://cdn.example/b.png?a=1&b=2");
  assert.equal(extractOgImageUrl(`<meta name="twitter:image" content="ogp.jpg">`, page), "https://example.jp/anime/top/ogp.jpg");
  assert.equal(extractOgImageUrl(`<meta property="og:image" content="javascript:alert(1)"><meta property=og:image:secure_url content=https://s.example/c.jpg>`, page), "https://s.example/c.jpg");
  assert.equal(extractOgImageUrl(`<meta property="og:title" content="x">`, page), undefined);
  for (const ip of ["127.0.0.1", "10.0.0.1", "192.168.1.1", "169.254.169.254", "172.16.0.1", "::1", "fd00::1", "::ffff:127.0.0.1"]) {
    assert.equal(isPrivateAddress(ip), true, ip);
  }
  assert.equal(isPrivateAddress("93.184.216.34"), false);
});

test("Annict's shared no-image placeholder is not treated as a real image", () => {
  const anime = toAnime({
    __typename: "Work", annictId: 2, title: "t", officialSiteUrl: "https://site.example/", twitterUsername: "x",
    watchersCount: 0, media: "TV",
    image: { __typename: "WorkImage", facebookOgImageUrl: "https://image.annict.com/x/s:640:853/plain/s3://annict-user-contents/no-image.jpg", recommendedImageUrl: "" },
  });
  assert.equal(anime?.image, PLACEHOLDER_IMAGE);
});

test("OGP image proxy only serves small raster images", async () => {
  const { toAllowedImageType, exceedsImageLimit, ogImageProxyPath, MAX_IMAGE_BYTES } = await import("../src/lib/og-image-proxy");
  for (const type of ["image/jpeg", "IMAGE/PNG; charset=binary", "image/webp", "image/gif", "image/avif"]) {
    assert.ok(toAllowedImageType(type), type);
  }
  for (const type of ["image/svg+xml", "text/html", "application/octet-stream", "image/x-icon", "", null]) {
    assert.equal(toAllowedImageType(type), undefined, String(type));
  }
  assert.equal(exceedsImageLimit(String(MAX_IMAGE_BYTES)), false);
  assert.equal(exceedsImageLimit(String(MAX_IMAGE_BYTES + 1)), true);
  assert.equal(exceedsImageLimit(null), false);
  assert.equal(ogImageProxyPath("https://a.example/?x=1&y=2", "k").startsWith("/api/og-image?u=https%3A%2F%2Fa.example%2F%3Fx%3D1%26y%3D2&sig="), true);
});

test("OGP image proxy rejects non-public sites and streamed bodies over the cap", async () => {
  const { isPublicHttpUrl, readBodyWithLimit } = await import("../src/lib/og-image");
  for (const url of ["http://127.0.0.1/", "http://localhost/", "http://[::1]/", "http://169.254.169.254/latest", "http://10.0.0.1/", "https://example.com:8443/", "ftp://example.com/"]) {
    assert.equal(await isPublicHttpUrl(new URL(url)), false, url);
  }
  assert.equal(await isPublicHttpUrl(new URL("http://93.184.216.34/")), true);
  const stream = (sizes: number[]) =>
    new Response(new ReadableStream({ start(c) { for (const n of sizes) c.enqueue(new Uint8Array(n)); c.close(); } }));
  assert.equal((await readBodyWithLimit(stream([60, 40]), 100, true))?.length, 100);
  assert.equal(await readBodyWithLimit(stream([60, 41]), 100, true), undefined);
  assert.equal((await readBodyWithLimit(stream([60, 60]), 100, false))?.length, 100);
});

test("OGP image proxy URLs must carry a valid HMAC signature", async () => {
  const { signImageUrl, verifyImageSignature } = await import("../src/lib/og-image-proxy");
  const sig = signImageUrl("https://a.example/", "secret");
  assert.equal(verifyImageSignature("https://a.example/", sig, "secret"), true);
  assert.equal(verifyImageSignature("https://b.example/", sig, "secret"), false);
  assert.equal(verifyImageSignature("https://a.example/", sig, "other"), false);
  assert.equal(verifyImageSignature("https://a.example/", `${sig}x`, "secret"), false);
  assert.equal(verifyImageSignature("https://a.example/", "", "secret"), false);
  assert.equal(verifyImageSignature("https://a.example/", null, "secret"), false);
});

test("only Annict's own hosts are served directly", async () => {
  const { isAnnictImageUrl } = await import("../src/lib/og-image-proxy");
  assert.equal(isAnnictImageUrl("https://image.annict.com/x/plain/s3://annict-user-contents/a.jpg"), true);
  assert.equal(isAnnictImageUrl("https://annict.com/a.jpg"), true);
  for (const url of ["https://image.annict.com.evil.com/a.jpg", "https://evilannict.com/a.jpg", "http://image.annict.com/a.jpg", "https://saikyosoubi.com/ogp02.jpg", "https://evil.com/?https://image.annict.com/", "nope"]) {
    assert.equal(isAnnictImageUrl(url), false, url);
  }
});

test("SSRF guard blocks IPv6 forms that embed private IPv4 addresses", async () => {
  const { isPrivateAddress, isPublicHttpUrl } = await import("../src/lib/og-image");
  const blocked = [
    "::ffff:7f00:1", "::ffff:a9fe:a9fe", "::ffff:a00:1", "::7f00:1", "64:ff9b::7f00:1", "::ffff:127.0.0.1",
    "2002:7f00:1::", "2002:a9fe:a9fe::1", "::", "::1", "fe80::1", "fc00::1", "ff02::1", "100::1", "2001:db8::1",
    "2001:0:4136:e378:8000:63bf:3fff:fdd2", "64:ff9b:1::1", "fec0::1", "0.0.0.0", "100.64.0.1", "192.0.0.1", "192.0.2.1", "198.18.0.1", "198.51.100.1", "203.0.113.1", "240.0.0.1", "255.255.255.255",
  ];
  for (const ip of blocked) assert.equal(isPrivateAddress(ip), true, ip);
  for (const ip of ["93.184.216.34", "2606:2800:220:1:248:1893:25c8:1946", "::ffff:5db8:d822", "64:ff9b::5db8:d822"]) {
    assert.equal(isPrivateAddress(ip), false, ip);
  }
  for (const url of ["http://[::ffff:7f00:1]/", "http://[::ffff:127.0.0.1]/", "http://[::ffff:a9fe:a9fe]/", "http://[::7f00:1]/", "http://[64:ff9b::7f00:1]/"]) {
    assert.equal(await isPublicHttpUrl(new URL(url)), false, url);
  }
});

test("connect-time DNS lookup only returns validated public addresses", async () => {
  const { createSafeLookup } = await import("../src/lib/og-image");
  const run = (addrs: { address: string; family: number }[], all = false) =>
    new Promise<{ err: Error | null; address?: unknown; family?: number }>((resolve) =>
      createSafeLookup(async () => addrs)("h.example", { all }, (err, address, family) => resolve({ err, address, family })),
    );
  const pub = { address: "93.184.216.34", family: 4 };
  assert.deepEqual(await run([pub]), { err: null, address: "93.184.216.34", family: 4 });
  assert.deepEqual((await run([pub], true)).address, [pub]);
  for (const bad of ["127.0.0.1", "169.254.169.254", "::ffff:7f00:1", "10.0.0.1", "::1"]) {
    const family = bad.includes(":") ? 6 : 4;
    assert.ok((await run([{ address: bad, family }])).err, bad);
    assert.ok((await run([pub, { address: bad, family }])).err, `mixed ${bad}`);
    assert.ok((await run([{ address: bad, family }, pub], true)).err, `mixed(all) ${bad}`);
  }
  assert.ok((await run([])).err);
  const failing = await new Promise<Error | null>((resolve) =>
    createSafeLookup(async () => { throw new Error("ENOTFOUND"); })("h.example", {}, (err) => resolve(err)),
  );
  assert.ok(failing);
});

test("the SSRF-safe agent refuses to connect when a hostname resolves to loopback", async () => {
  const { createServer } = await import("node:http");
  const { createSafeAgent } = await import("../src/lib/og-image");
  const { fetch: undiciFetch } = await import("undici");
  let hits = 0;
  const server = createServer((_req, res) => { hits++; res.end("secret"); });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address() as { port: number };
  try {
    // DNS は常に 127.0.0.1 を返す (rebinding 後を模擬)。URL 検証を通過した後でも接続が拒否される
    const agent = createSafeAgent(async () => [{ address: "127.0.0.1", family: 4 }]);
    await assert.rejects(undiciFetch(`http://rebind.example:${port}/`, { dispatcher: agent }));
    assert.equal(hits, 0);
  } finally {
    server.close();
  }
});

test("OGP fetch failures are classified so only definitive results get cached", async () => {
  const og = await import("../src/lib/og-image");
  for (const status of [200, 204]) assert.equal(og.classifyOgStatus(status), "ok");
  for (const status of [404, 410, 401, 451]) assert.equal(og.classifyOgStatus(status), "none");
  for (const status of [403, 408, 429, 500, 502, 503]) assert.equal(og.classifyOgStatus(status), "transient");

  // 非公開ホストは確定結果 (undefined) で、失敗としては記憶されない
  og.clearOgFailures();
  assert.equal(await og.fetchOgImageUrl("http://127.0.0.1/"), undefined);
  assert.equal(og.isOgFailureCached("http://127.0.0.1/"), false);

  // 負キャッシュ: 記憶中はネットワークに行かず即 throw し、期限後は解除、サイズは有界
  og.rememberOgFailure("https://dead.example/", 1_000);
  assert.equal(og.isOgFailureCached("https://dead.example/", 1_000 + 60_000), true);
  assert.equal(og.isOgFailureCached("https://dead.example/", 1_000 + 5 * 60_000 + 1), false);
  og.rememberOgFailure("https://dead.example/");
  await assert.rejects(og.fetchOgImageUrl("https://dead.example/"), og.OgFetchTransientError);
  og.clearOgFailures();
  for (let i = 0; i < 600; i++) og.rememberOgFailure(`https://s${i}.example/`);
  assert.equal(og.isOgFailureCached("https://s0.example/"), false);
  assert.equal(og.isOgFailureCached("https://s599.example/"), true);
  og.clearOgFailures();
});
