import {
  redirectUrlWithAuthToast,
  type AuthToastIntent,
} from "@/lib/auth-redirect";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";
  const rawIntent = searchParams.get("intent");
  const intent: AuthToastIntent = rawIntent === "link" ? "link" : "login";
  const errorParam = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  if (errorParam) {
    console.error("OAuth callback error:", errorParam, errorDescription);
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(errorDescription || errorParam)}`,
    );
  }

  if (code) {
    try {
      const supabase = await createSupabaseServerClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(
          redirectUrlWithAuthToast(origin, next, intent),
        );
      }
      console.error("auth/callback: exchangeCodeForSession failed", {
        message: error.message,
        status: error.status,
        code: error.code,
        origin,
        intent,
      });
      return NextResponse.redirect(`${origin}/login?error=exchange_failed`);
    } catch (error) {
      // 例外をそのまま投げると 500 になり原因が追えないため、ログに残して /login へ戻す
      console.error("auth/callback: unexpected error", {
        origin,
        intent,
        error,
      });
      return NextResponse.redirect(`${origin}/login?error=callback_exception`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}
