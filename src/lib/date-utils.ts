import { toZonedTime as utcToZonedTime } from "date-fns-tz";

export { utcToZonedTime };


/**
 * 常に日本時間（Asia/Tokyo）に変換された Date オブジェクトを返します。
 * Vercel などの UTC 環境下でも、日本時間ベースの判定が可能になります。
 */
export function getJSTDate(date: Date = new Date()) {
  return utcToZonedTime(date, "Asia/Tokyo");
}
