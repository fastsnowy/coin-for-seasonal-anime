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
