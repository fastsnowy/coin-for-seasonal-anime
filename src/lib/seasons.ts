import { getJSTDate } from "./date-utils";
export type Season = "spring" | "summer" | "autumn" | "winter";


export type SeasonInfo = {
  id: Season;
  name: string;
};

export function getCurrentSeason(): SeasonInfo {
  const month = getJSTDate().getMonth() + 1;
  if (month >= 1 && month <= 3) return { id: "winter", name: "冬" };
  if (month >= 4 && month <= 6) return { id: "spring", name: "春" };
  if (month >= 7 && month <= 9) return { id: "summer", name: "夏" };
  return { id: "autumn", name: "秋" };
}

export function getNextSeason(): { id: Season; name: string; year: number } {
  const current = getCurrentSeason();
  const currentYear = getJSTDate().getFullYear();

  switch (current.id) {
    case "winter":
      return { id: "spring", name: "春", year: currentYear };
    case "spring":
      return { id: "summer", name: "夏", year: currentYear };
    case "summer":
      return { id: "autumn", name: "秋", year: currentYear };
    case "autumn":
      return { id: "winter", name: "冬", year: currentYear + 1 };
    default:
      return { id: "winter", name: "冬", year: currentYear };
  }
}

export function getSeasonName(season: Season): string {
  const seasons: Record<Season, string> = {
    spring: "春",
    summer: "夏",
    autumn: "秋",
    winter: "冬",
  };
  return seasons[season];
}

export function getSeasonType(
  year: number,
  season: Season,
): "current" | "next" | "past" {
  const currentYear = getJSTDate().getFullYear();
  const currentSeason = getCurrentSeason();
  const nextSeason = getNextSeason();

  if (year === currentYear && season === currentSeason.id) {
    return "current";
  }
  if (year === nextSeason.year && season === nextSeason.id) {
    return "next";
  }
  return "past";
}
