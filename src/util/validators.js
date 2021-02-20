import { helpers } from 'vuelidate/lib/validators'

export function decimalComma (digits) {
  return helpers.regex(
    'decimalComma',
    new RegExp(`^\\d+(\\,\\d{1,${digits}})?$`)
  )
}

export const format = helpers.regex(
  'format',
  /^\d+((,|\.)\d{1,2})? (x|×) \d+((,|\.)\d{1,2})?$/
)

export function isbn (isbn) {
  isbn = isbn.replace(/-/g, '')

  if (isbn.length !== 10 && isbn.length !== 13) {
    return false
  }

  if (!isbn.match(/^[0-9]{13}$|^[0-9]{9}[0-9xX]{1}$/)) {
    return false
  }

  if (isbn.length === 10) {
    const sum = isbn.split('')
      .map((d, i) => (10 - i) * (d === 'X' ? 10 : parseInt(d)))
      .reduce((acm, cv) => acm + cv)

    return sum % 11 === 0
  }

  const sum = isbn.split('')
    .map((d, i) => (((i + 1) % 2 === 0) ? 3 : 1) * parseInt(d))
    .reduce((acm, cv) => acm + cv)

  return sum % 10 === 0
}
