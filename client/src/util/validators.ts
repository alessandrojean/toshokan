import { helpers } from '@vuelidate/validators'
import ISBN from 'isbn3'

export function decimalComma(digits: number) {
  return helpers.regex(new RegExp(`^\\d+([\\,\\.]\\d{1,${digits}})?$`))
}

export const dimension = decimalComma(2)

export function isbn(isbn?: string): boolean {
  return isbn !== null && isbn !== undefined && ISBN.parse(isbn) !== null
}

export function issn(issn?: string) {
  issn = issn?.replace(/-/g, '') ?? ''

  if (!issn.match(/^[0-9]{7}[0-9xX]{1}$/)) {
    return false
  }

  const withoutDigit = issn.slice(0, -1)
  let calcDigit = withoutDigit
    .split('')
    .map((d, i) => Number.parseInt(d, 10) * (8 - i))
    .reduce((acm, cv) => acm + cv, 0)
  calcDigit = calcDigit % 11
  calcDigit = calcDigit !== 0 ? 11 - calcDigit : calcDigit
  const calcDigitStr = calcDigit === 10 ? 'X' : calcDigit.toString()

  return calcDigitStr === issn.slice(-1)
}

export function ean(ean?: string) {
  ean = ean?.replace(/-/g, '') ?? ''

  if (!ean.match(/^\d{13}$/)) {
    return false
  }

  const withoutDigit = ean.slice(0, -1)
  const checkSum = withoutDigit
    .split('')
    .map((d, i) => Number.parseInt(d, 10) * ((i + 1) % 2 === 0 ? 3 : 1))
    .reduce((acm, cv) => acm + cv, 0)

  return (10 - (checkSum % 10)) % 10 === Number.parseInt(ean.slice(-1), 10)
}

export function isoDate(dateString?: string, incomplete?: boolean) {
  if (typeof dateString !== 'string') {
    return false
  }

  if (!incomplete && !dateString.match(/^\d{4}-\d{1,2}-\d{1,2}$/)) {
    return false
  }

  if (incomplete && !dateString.match(/^\d{4}(-\d{1,2}){0,2}$/)) {
    return false
  }

  const parts = dateString.split('-')
  const day = Number.parseInt(parts[2] || '1', 10)
  const month = Number.parseInt(parts[1] || '1', 10)
  const year = Number.parseInt(parts[0], 10)

  if (year < 1000 || year > 3000 || month === 0 || month > 12) {
    return false
  }

  const monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

  if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
    monthLength[1] = 29
  }

  return day > 0 && day <= monthLength[month - 1]
}
