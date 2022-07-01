import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'
import tz from 'dayjs/plugin/timezone'

dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(tz)
export default dayjs

export const convertMinuteDecimalToHoursAndMinutes = (mins) => {
  const hours = Math.floor(mins / 60)
  let minutes = mins % 60
  if (minutes < 10) {
    minutes = `0${minutes}`
  }
  return `${hours}:${minutes}`
}
