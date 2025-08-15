import dayjs from 'dayjs'

export const DATE_FORMAT = 'DD.MM.YYYY'

export const formatDate = (isoDate: string) => {
  return dayjs(isoDate).format(DATE_FORMAT)
}
