/**
 * 外部APIから受け取ったURLを、リンクや画像に使える http(s) の絶対URLに限定する。
 * `javascript:` などの危険なスキームや認証情報入りのURLは undefined を返す。
 */
export function toSafeHttpUrl(value: unknown): string | undefined {
  if (typeof value !== "string" || value.length === 0 || value.length > 2048) {
    return undefined;
  }
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return undefined;
    if (url.username || url.password) return undefined;
    return url.toString();
  } catch {
    return undefined;
  }
}

/** X(Twitter) のユーザー名として有効な文字列のみ通す */
export function toSafeTwitterUsername(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const username = value.trim().replace(/^@/, "");
  return /^[A-Za-z0-9_]{1,15}$/.test(username) ? username : undefined;
}

/** CSS の url() に安全に埋め込むため、検証済みURLを引用符付きで返す */
export function toCssUrl(value: string): string | undefined {
  const url = toSafeHttpUrl(value) ?? (value.startsWith("/") && !value.startsWith("//") ? value : undefined);
  return url ? `url(${JSON.stringify(url)})` : undefined;
}
