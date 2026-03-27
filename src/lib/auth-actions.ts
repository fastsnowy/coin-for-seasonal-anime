"use server";

import { createSupabaseServerClient } from "./supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import type { Provider } from "@supabase/supabase-js";

async function getBaseUrl() {
  const headersList = await headers();
  const origin =
    headersList.get("origin") || headersList.get("x-forwarded-host") || "";
  const protocol = headersList.get("x-forwarded-proto") || "https";
  return origin.startsWith("http") ? origin : `${protocol}://${origin}`;
}

async function signInWithOAuthProvider(provider: Provider) {
  const supabase = await createSupabaseServerClient();
  const baseUrl = await getBaseUrl();

  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  if (currentUser?.is_anonymous) {
    const { data, error } = await supabase.auth.linkIdentity({
      provider,
      options: { redirectTo: `${baseUrl}/auth/callback` },
    });
    if (error || !data.url) {
      return { error: `${provider}連携に失敗しました` };
    }
    redirect(data.url);
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${baseUrl}/auth/callback` },
  });

  if (error || !data.url) {
    return { error: `${provider}ログインに失敗しました` };
  }

  redirect(data.url);
}

export async function signInWithDiscord() {
  return signInWithOAuthProvider("discord");
}

export async function signInWithGoogle() {
  return signInWithOAuthProvider("google");
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/");
}
