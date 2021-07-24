import { helpers } from '@vuelidate/validators'

export function decimalComma (digits) {
  return helpers.regex(
    new RegExp(`^\\d+([\\,\\.]\\d{1,${digits}})?$`)
  )
}

export const format = helpers.regex(
  /^\d+((,|\.)\d{1,2})? (x|×) \d+((,|\.)\d{1,2})?$/
)

export function isbn (isbn) {
  isbn = isbn.replace(/-/g, '')

  if (isbn.length !== 10 && isbn.length !== 13) {
    return false
  }

  if (!isbn.match(/^(978|979)[0-9]{10}$|^[0-9]{9}[0-9xX]{1}$/)) {
    return false
  }

  if (isbn.length === 10) {
    const sum = isbn.split('')
      .map((d, i) => (10 - i) * (d === 'X' ? 10 : parseInt(d, 10)))
      .reduce((acm, cv) => acm + cv)

    return sum % 11 === 0
  }

  const sum = isbn.split('')
    .map((d, i) => (((i + 1) % 2 === 0) ? 3 : 1) * parseInt(d, 10))
    .reduce((acm, cv) => acm + cv)

  return sum % 10 === 0
}

export function issn (issn) {
  issn = issn.replace(/-/g, '')

  if (!issn.match(/^[0-9]{7}[0-9xX]{1}$/)) {
    return false
  }

  const withoutDigit = issn.slice(0, -1)
  let calcDigit = withoutDigit.split('')
    .map((d, i) => parseInt(d, 10) * (8 - i))
    .reduce((acm, cv) => acm + cv, 0)
  calcDigit = calcDigit % 11
  calcDigit = calcDigit !== 0 ? 11 - calcDigit : calcDigit
  const calcDigitStr = calcDigit === 10 ? 'X' : calcDigit.toString()

  return calcDigitStr === issn.slice(-1)
}

export function ean (ean) {
  ean = ean.replace(/-/g, '')

  if (!ean.match(/^\d{13}$/)) {
    return false
  }

  const withoutDigit = ean.slice(0, -1)
  const checkSum = withoutDigit.split('')
    .map((d, i) => parseInt(d, 10) * ((i + 1) % 2 === 0 ? 3 : 1))
    .reduce((acm, cv) => acm + cv, 0)

  return (10 - (checkSum % 10)) % 10 === parseInt(ean.slice(-1), 10)
}
