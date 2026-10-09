export type AuthToastIntent = "login" | "link";

export function sanitizeNextPath(next: string | null | undefined): string {
  // Browsers remove tabs/newlines when parsing URLs, which can turn /<tab>/ into // .
  if (!next || /[\u0000-\u0020\u007f]/.test(next)) return "/";
  if (!next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) {
    return "/";
  }
  if (next.includes("://") || next.includes("\\")) {
    return "/";
  }
  try {
    const decoded = decodeURIComponent(next);
    if (
      /[\u0000-\u001f\u007f]/.test(decoded) ||
      decoded.startsWith("//") ||
      decoded.includes("://") ||
      decoded.includes("\\")
    ) {
      return "/";
    }
  } catch {
    return "/";
  }
  return next;
}

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  exchange_failed: "認証の完了に失敗しました。もう一度お試しください。",
  callback_exception: "認証処理中にエラーが発生しました。もう一度お試しください。",
  auth_callback_error: "認証情報を受け取れませんでした。もう一度お試しください。",
};

export function getAuthErrorMessage(error: string | undefined): string {
  if (!error) return "認証エラーが発生しました。もう一度お試しください。";
  return (
    AUTH_ERROR_MESSAGES[error] ??
    "認証エラーが発生しました。もう一度お試しください。"
  );
}

/** OAuth / メール確認後のリダイレクト先に、完了トースト用のクエリを付与する */
export function redirectUrlWithAuthToast(
  origin: string,
  nextPath: string,
  intent: AuthToastIntent = "login",
): string {
  const path = sanitizeNextPath(nextPath);
  const sep = path.includes("?") ? "&" : "?";
  const param = intent === "link" ? "linked=1" : "logged_in=1";
  return `${origin}${path}${sep}${param}`;
}
