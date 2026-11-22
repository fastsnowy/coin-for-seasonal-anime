import { NextResponse } from "next/server";

const ANNICT_ME_URL = "https://api.annict.com/v1/me";

/**
 * Annict /v1/me のレスポンスを Supabase GoTrue が要求する形式に変換するプロキシ。
 * Annict は `id` を返すが、GoTrue は `sub` を要求するため `id` → `sub` (文字列) に変換する。
 * 記録数・通知数・プロフィール文など本サービスで使わない項目は Supabase に渡さない。
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !/^Bearer \S+$/i.test(authHeader)) {
    return NextResponse.json(
      { error: "Missing authorization header" },
      { status: 401 },
    );
  }

  const res = await fetch(ANNICT_ME_URL, {
    headers: { Authorization: authHeader },
    cache: "no-store",
    redirect: "error",
    signal: AbortSignal.timeout(10000),
  });

  if (!res.ok) {
    console.error("Annict /v1/me failed:", res.status);
    return NextResponse.json(
      { error: "Failed to fetch Annict user info" },
      { status: res.status },
    );
  }

  const data = (await res.json()) as AnnictMe;
  if (!Number.isSafeInteger(data?.id)) {
    return NextResponse.json(
      { error: "Invalid Annict user info" },
      { status: 502 },
    );
  }

  return NextResponse.json(pickUserInfo(data), {
    headers: { "Cache-Control": "private, no-store" },
  });
}

type AnnictMe = {
  id: number;
  username?: unknown;
  name?: unknown;
  avatar_url?: unknown;
  email?: unknown;
};

const optionalString = (value: unknown) =>
  typeof value === "string" && value.length > 0 ? value : undefined;

/** ログインと画面表示に必要な項目だけを返す（データ最小化） */
function pickUserInfo(data: AnnictMe) {
  return {
    id: data.id,
    sub: String(data.id), // GoTrue は `sub` を一意識別子として使用
    username: optionalString(data.username),
    name: optionalString(data.name),
    avatar_url: optionalString(data.avatar_url),
    // Supabase Auth のアカウント識別に使用（本サービスからメールは送信しない）
    email: optionalString(data.email),
    email_verified: true, // メール確認フローをスキップ
  };
}
