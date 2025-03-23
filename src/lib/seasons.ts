export type Season = "spring" | "summer" | "autumn" | "winter"

export type SeasonInfo = {
  id: Season
  name: string
}

export function getCurrentSeason(): SeasonInfo {
  const month = new Date().getMonth() + 1
  if (month >= 3 && month <= 5) return { id: "spring", name: "春" }
  if (month >= 6 && month <= 8) return { id: "summer", name: "夏" }
  if (month >= 9 && month <= 11) return { id: "autumn", name: "秋" }
  return { id: "winter", name: "冬" }
}

export function getNextSeason(): { id: Season; name: string; year: number } {
  const current = getCurrentSeason()
  const currentYear = new Date().getFullYear()

  switch (current.id) {
    case "spring":
      return { id: "summer", name: "夏", year: currentYear }
    case "summer":
      return { id: "autumn", name: "秋", year: currentYear }
    case "autumn":
      return { id: "winter", name: "冬", year: currentYear }
    case "winter":
      return { id: "spring", name: "春", year: currentYear + 1 }
    default:
      return { id: "spring", name: "春", year: currentYear }
  }
}

export function getSeasonName(season: Season): string {
  const seasons: Record<Season, string> = {
    spring: "春",
    summer: "夏",
    autumn: "秋",
    winter: "冬",
  }
  return seasons[season]
}

export function getSeasonType(year: number, season: Season): "current" | "next" | "past" {
  const currentYear = new Date().getFullYear()
  const currentSeason = getCurrentSeason()
  const nextSeason = getNextSeason()

  if (year === currentYear && season === currentSeason.id) {
    return "current"
  } else if (year === nextSeason.year && season === nextSeason.id) {
    return "next"
  } else {
    return "past"
  }
}

