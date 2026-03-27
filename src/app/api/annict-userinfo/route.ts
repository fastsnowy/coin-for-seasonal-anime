import { NextResponse } from "next/server";

const ANNICT_ME_URL = "https://api.annict.com/v1/me";

/**
 * Annict /v1/me のレスポンスを Supabase GoTrue が要求する形式に変換するプロキシ。
 * Annict は `id` を返すが、GoTrue は `sub` を要求するため、
 * `id` → `sub` (文字列) への変換と、ダミー email の付与を行う。
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return NextResponse.json(
      { error: "Missing authorization header" },
      { status: 401 },
    );
  }

  const res = await fetch(ANNICT_ME_URL, {
    headers: { Authorization: authHeader },
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("Annict /v1/me failed:", res.status, body);
    return NextResponse.json(
      { error: "Failed to fetch Annict user info" },
      { status: res.status },
    );
  }

  const data = await res.json();

  // Supabase GoTrue が必要とするフィールドを追加
  return NextResponse.json({
    ...data,
    sub: String(data.id), // GoTrue は `sub` を一意識別子として使用
  });
}
