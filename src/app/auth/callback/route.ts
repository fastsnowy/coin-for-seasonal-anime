import {
  redirectUrlWithAuthToast,
  sanitizeNextPath,
  type AuthToastIntent,
} from "@/lib/auth-redirect";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = sanitizeNextPath(searchParams.get("next"));
  const rawIntent = searchParams.get("intent");
  const intent: AuthToastIntent = rawIntent === "link" ? "link" : "login";
  const errorParam = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");
  const errorPath = intent === "link" ? "/link" : "/login";

  const redirectWithError = (error: string) =>
    NextResponse.redirect(
      `${origin}${errorPath}?error=${encodeURIComponent(error)}`,
    );

  if (errorParam) {
    console.error("OAuth callback error:", errorParam, errorDescription);
    return redirectWithError(errorDescription || errorParam);
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
      return redirectWithError("exchange_failed");
    } catch (error) {
      console.error("auth/callback: unexpected error", {
        origin,
        intent,
        error,
      });
      return redirectWithError("callback_exception");
    }
  }

  return redirectWithError("auth_callback_error");
}
