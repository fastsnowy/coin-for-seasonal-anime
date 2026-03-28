"use server";

import { createSupabaseServerClient } from "./supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

async function getBaseUrl() {
  const headersList = await headers();
  const origin =
    headersList.get("origin") || headersList.get("x-forwarded-host") || "";
  const protocol = headersList.get("x-forwarded-proto") || "https";
  return origin.startsWith("http") ? origin : `${protocol}://${origin}`;
}

const ANNICT_PROVIDER = "custom:annict" as const;

export async function loginWithAnnict() {
  const supabase = await createSupabaseServerClient();
  const baseUrl = await getBaseUrl();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: ANNICT_PROVIDER,
    options: {
      redirectTo: `${baseUrl}/auth/callback?intent=login`,
    },
  });

  if (error || !data.url) {
    return { error: "ログインに失敗しました" };
  }

  redirect(data.url);
}

export async function linkAnnict() {
  const supabase = await createSupabaseServerClient();
  const baseUrl = await getBaseUrl();

  const { data, error } = await supabase.auth.linkIdentity({
    provider: ANNICT_PROVIDER,
    options: {
      redirectTo: `${baseUrl}/auth/callback?intent=link`,
    },
  });

  if (error || !data.url) {
    return { error: error?.message ?? "アカウント連携に失敗しました" };
  }

  redirect(data.url);
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function deleteAccount() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.is_anonymous) {
    return { error: "認証されたユーザーのみ退会できます" };
  }

  const { data: identitiesData, error: identitiesError } =
    await supabase.auth.getUserIdentities();
  if (identitiesError) {
    return { error: "連携情報の取得に失敗しました" };
  }

  const annictIdentity = identitiesData?.identities?.find(
    (identity) => identity.provider === ANNICT_PROVIDER,
  );

  if (!annictIdentity) {
    return { error: "Annict連携が見つかりません" };
  }

  const { error } = await supabase.auth.unlinkIdentity(annictIdentity);
  if (error) {
    return { error: "退会処理に失敗しました" };
  }

  await supabase.auth.signOut();
  redirect("/");
}
