import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)
export default dayjs

export const convertMinuteDecimalToHoursAndMinutes = (mins) => {
  const hours = Math.floor(mins / 60)
  const minutes = mins % 60
  return `${hours}:${minutes}`
}
