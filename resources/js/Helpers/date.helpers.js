import { format } from 'date-fns'

export const convertMinuteDecimalToHoursAndMinutes = (mins) => {
  const hours = Math.floor(mins / 60)
  let minutes = mins % 60
  if (minutes < 10) {
    minutes = `0${minutes}`
  }
  return `${hours}:${minutes}`
}

export const formatDate = (dateString) => {
  return format(new Date(dateString), 'MMM dd, yyyy')
}
