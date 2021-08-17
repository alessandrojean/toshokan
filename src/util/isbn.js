import { isbn as validateIsbn } from './validators'

export function convertIsbn13ToIsbn10 (isbn13) {
  isbn13 = isbn13.replace(/-/g, '')

  if (isbn13.length === 10) {
    return isbn13
  }

  const equalPart = isbn13.slice(3, -1)
  const sum = equalPart.split('')
    .map((d, i) => parseInt(d, 10) * (i + 1))
    .reduce((acm, crr) => acm + crr, 0)
  const lastDigit = sum % 11

  return equalPart + (lastDigit === 10 ? 'X' : lastDigit)
}

// TODO: handle additional cases.
const REGISTRATION_GROUPS = {
  0: ['US', 'en'],
  1: ['US', 'en'],
  2: ['FR', 'fr'],
  3: ['DE', 'de'],
  4: ['JP', 'ja'],
  5: ['RU', 'ru'],
  7: ['CN', 'zh'],
  65: ['BR', 'pt-BR'],
  85: ['BR', 'pt-BR'],
  88: ['IT', 'it'],
  89: ['KR', 'ko']
}

export function getIsbnCountry (isbn) {
  if (!validateIsbn(isbn)) {
    return null
  }

  isbn = isbn.replace(/-/g, '')
    .replace(/^97[8|9]/, '')

  // Check the first digit.
  if (REGISTRATION_GROUPS[isbn.charAt(0)] !== undefined) {
    return REGISTRATION_GROUPS[isbn.charAt(0)]
  }

  // Check the first and second digit.
  if (REGISTRATION_GROUPS[isbn.substring(0, 2)] !== undefined) {
    return REGISTRATION_GROUPS[isbn.substring(0, 2)]
  }

  return null
}
