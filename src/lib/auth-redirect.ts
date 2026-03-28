export type AuthToastIntent = "login" | "link";

/** OAuth / メール確認後のリダイレクト先に、完了トースト用のクエリを付与する */
export function redirectUrlWithAuthToast(
  origin: string,
  nextPath: string,
  intent: AuthToastIntent = "login",
): string {
  const path =
    nextPath && nextPath.startsWith("/") ? nextPath : "/";
  const sep = path.includes("?") ? "&" : "?";
  const param = intent === "link" ? "linked=1" : "logged_in=1";
  return `${origin}${path}${sep}${param}`;
}
