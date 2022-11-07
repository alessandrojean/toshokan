/**
 * Computes the last day of a month in a year.
 *
 * @param {number} year The year
 * @param {number} month The month
 * @returns {number | null} The last day of the month
 */
export function lastDayOfMonth(year: number, month: number): number | null {
  if (year < 1000 || year > 3000 || month === 0 || month > 12) {
    return null
  }

  const monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

  if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
    monthLength[1] = 29
  }

  return monthLength[month - 1]
}

export function isoDate(date: string) {
  return date.replace(/-(\d)-/, '0$1').replace(/-(\d)$/, '0$1')
}

export function formatDateToSheet(date: Date) {
  return `=DATE(${date.getUTCFullYear()}, ${
    date.getUTCMonth() + 1
  }, ${date.getUTCDate()})`
}

export function formatDateTimeToSheet(date: Date) {
  return (
    formatDateToSheet(date) +
    ' + ' +
    `TIME(${date.getUTCHours()}, ${date.getUTCMinutes()}, ${date.getUTCSeconds()})`
  )
}

export function fixDate(date: Date, timezoneOffset: number) {
  if (date) {
    const copy = new Date(date)
    copy.setMinutes(date.getMinutes() - timezoneOffset)

    return copy
  }

  return date
}
