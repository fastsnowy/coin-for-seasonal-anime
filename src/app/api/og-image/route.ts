import { fetchPublic, readBodyWithLimit } from "@/lib/og-image";
import { exceedsImageLimit, MAX_IMAGE_BYTES, toAllowedImageType, verifyImageSignature } from "@/lib/og-image-proxy";
import { getOgImageProxySecret } from "@/lib/og-image-secret";
import { toSafeHttpUrl } from "@/lib/safe-url";

export const runtime = "nodejs";
export const maxDuration = 10;

// 画像取得の合計時間の上限 (リダイレクト含む)
const TOTAL_BUDGET_MS = 8_000;

const CACHE_CONTROL = "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800";

function notFound() {
  return new Response(null, {
    status: 404,
    headers: { "Cache-Control": "public, max-age=300, s-maxage=300" },
  });
}

/**
 * 外部画像を同一オリジンで返す。
 * 一部サイトは画像に `Cross-Origin-Resource-Policy: same-origin` を付けており、
 * ブラウザから直接 <img> 表示できないため、サーバー経由で配信する。
 * `u` はサーバーが署名した画像URL (anime-data.ts が発行) のみ受け付ける。署名が無い/不一致なら
 * 外部へ一切取得に行かず 404 を返すため、任意URLを中継するオープンプロキシにはならない。
 * 取得時も fetchPublic が公開ホストか (リダイレクト先含む) を検証する。
 */
export async function GET(request: Request) {
  try {
    const params = new URL(request.url).searchParams;
    const imageParam = params.get("u");
    if (!imageParam || !verifyImageSignature(imageParam, params.get("sig"), getOgImageProxySecret())) {
      return notFound();
    }
    const imageUrl = toSafeHttpUrl(imageParam);
    if (!imageUrl) return notFound();

    const signal = AbortSignal.timeout(TOTAL_BUDGET_MS);
    const fetched = await fetchPublic(new URL(imageUrl), "image/avif,image/webp,image/*;q=0.8", { signal });
    if (!fetched || !fetched.res.ok) return notFound();
    const { res } = fetched;

    const type = toAllowedImageType(res.headers.get("content-type"));
    if (!type || exceedsImageLimit(res.headers.get("content-length"))) {
      await res.body?.cancel().catch(() => undefined);
      return notFound();
    }
    const body = await readBodyWithLimit(res, MAX_IMAGE_BYTES, true);
    if (!body || body.length === 0) return notFound();

    return new Response(body as BodyInit, {
      headers: {
        "Content-Type": type,
        "Content-Length": String(body.length),
        "Cache-Control": CACHE_CONTROL,
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return notFound();
  }
}
