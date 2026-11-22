import { fetchOgImageUrl, fetchPublic, isPublicHttpUrl, readBodyWithLimit } from "@/lib/og-image";
import { exceedsImageLimit, MAX_IMAGE_BYTES, toAllowedImageType } from "@/lib/og-image-proxy";
import { toSafeHttpUrl } from "@/lib/safe-url";

export const runtime = "nodejs";

const CACHE_CONTROL = "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800";

function notFound() {
  return new Response(null, {
    status: 404,
    headers: { "Cache-Control": "public, max-age=300, s-maxage=300" },
  });
}

/**
 * 公式サイトの OGP 画像を同一オリジンで返す。
 * 一部サイトは画像に `Cross-Origin-Resource-Policy: same-origin` を付けており、
 * ブラウザから直接 <img> 表示できないため、サーバー経由で配信する。
 * 任意URLは受け付けず、公式サイトURL -> OGP 解決 -> 画像取得の経路に限定する。
 */
export async function GET(request: Request) {
  try {
    const site = toSafeHttpUrl(new URL(request.url).searchParams.get("site"));
    if (!site || !(await isPublicHttpUrl(new URL(site)))) return notFound();

    const imageUrl = await fetchOgImageUrl(site);
    if (!imageUrl) return notFound();

    const fetched = await fetchPublic(new URL(imageUrl), "image/avif,image/webp,image/*;q=0.8");
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
