import { redirectUrlWithAuthToast, sanitizeNextPath } from "@/lib/auth-redirect";
import { getSiteOrigin } from "@/lib/site-origin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const EMAIL_OTP_TYPES = new Set<EmailOtpType>([
  "signup",
  "invite",
  "magiclink",
  "recovery",
  "email_change",
  "email",
]);

function isEmailOtpType(value: string | null): value is EmailOtpType {
  return value !== null && EMAIL_OTP_TYPES.has(value as EmailOtpType);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  // リダイレクト先は Host ヘッダーではなく設定済みのオリジンから組み立てる
  const origin = getSiteOrigin();
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = sanitizeNextPath(searchParams.get("next"));

  if (tokenHash && isEmailOtpType(type)) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    });
    if (!error) {
      return NextResponse.redirect(redirectUrlWithAuthToast(origin, next));
    }
  }

  return NextResponse.redirect(`${origin}/login?error=verification_error`);
}
