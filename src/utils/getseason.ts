import utcToZonedTime from 'date-fns-tz/utcToZonedTime'

export const getSeasons = () => {
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
    current: `${currentDate.getFullYear()}-${getMonth2Season(currentDate.getMonth())}`,
    next: `${nextDate.getFullYear()}-${getMonth2Season(nextDate.getMonth())}`,
  }
}
