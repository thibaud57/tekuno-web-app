import { DateTime } from 'luxon'

export const getIsoDate = (date: Date = new Date()): string => {
    const dt = DateTime.fromJSDate(date)
    return dt.toFormat('yyyy-MM-dd-HH-mm-ss')
}
