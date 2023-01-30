export const seasons = () => {
  const currentDate = new Date()
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
    current: {
      year: currentDate.getFullYear(),
      season: getMonth2Season(currentDate.getMonth()),
    },
  }
}
