/** OAuth callbacks must not trust client-supplied Origin or forwarded headers. */
export function getSiteOrigin(): string {
  const configured = process.env.APP_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.NODE_ENV !== "production" ? "http://localhost:3000" : undefined);
  if (!configured) throw new Error("APP_URL must be configured in production");
  const url = new URL(configured);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password ||
      (process.env.NODE_ENV === "production" && url.protocol !== "https:")) {
    throw new Error("Invalid APP_URL");
  }
  return url.origin;
}
