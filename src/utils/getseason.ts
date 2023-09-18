import utcToZonedTime from 'date-fns-tz/utcToZonedTime'

export const getCurrentNextSeasons = () => {
  const currentDate = utcToZonedTime(new Date(), 'Asia/Tokyo')
  currentDate.setDate(1)
  const nextDate = utcToZonedTime(new Date(currentDate), 'Asia/Tokyo')
  nextDate.setMonth(currentDate.getMonth() + 3)
  const SEASONS = {
    winter: 'winter',
    spring: 'spring',
    summer: 'summer',
    autumn: 'autumn',
  }
  const getMonth2Season = (month: number) => {
    if (0 <= month && month <= 2) {
      return SEASONS.winter
    } else if (3 <= month && month <= 5) {
      return SEASONS.spring
    } else if (6 <= month && month <= 8) {
      return SEASONS.summer
    } else {
      return SEASONS.autumn
    }
  }
  return {
    // 2000年から現在までの各シーズンを取得
    // seasons: [...Array(currentDate.getFullYear() - 2000 + 1)].map((_, i) => {
    //   const year = 2000 + i
    //   return {
    //     // 各季節をseasonsとして渡す
    //     winter: `${year}-${SEASONS.winter}`,
    //     spring: `${year}-${SEASONS.spring}`,
    //     summer: `${year}-${SEASONS.summer}`,
    //     autumn: `${year}-${SEASONS.autumn}`,
    //   }
    // }),

    current: `${currentDate.getFullYear()}-${getMonth2Season(currentDate.getMonth())}`,
    next: `${nextDate.getFullYear()}-${getMonth2Season(nextDate.getMonth())}`,
  }
}

export function getSeasons(): { seasons: string }[] {
  const SEASONS = {
    winter: 'winter',
    spring: 'spring',
    summer: 'summer',
    autumn: 'autumn',
  } as const

  const currentDate = utcToZonedTime(new Date(), 'Asia/Tokyo')
  currentDate.setDate(1)
  const nextDate = utcToZonedTime(new Date(currentDate), 'Asia/Tokyo')
  nextDate.setMonth(currentDate.getMonth() + 3)
  const currentYear = currentDate.getFullYear()

  const seasons = []
  const getMonth2Season = (month: number) => {
    if (0 <= month && month <= 2) {
      return SEASONS.winter
    } else if (3 <= month && month <= 5) {
      return SEASONS.spring
    } else if (6 <= month && month <= 8) {
      return SEASONS.summer
    } else {
      return SEASONS.autumn
    }
  }

  for (let year = 2000; year <= currentYear; year++) {
    for (let month = 0; month < 12; month += 3) {
      const season = getMonth2Season(month)
      const seasonString = `${year}-${SEASONS[season]}`
      seasons.push({ seasons: seasonString })
    }
  }
  return seasons
}
