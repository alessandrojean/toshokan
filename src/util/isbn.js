import { getFlagUrl } from '.'
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
  84: ['ES', 'es'],
  85: ['BR', 'pt-BR'],
  88: ['IT', 'it'],
  89: ['KR', 'ko'],
  607: ['MX', 'es'],
  612: ['PE', 'es'],
  950: ['AR', 'es'],
  956: ['CL', 'es'],
  958: ['CO', 'es'],
  968: ['MX', 'es'],
  970: ['MX', 'es'],
  972: ['PT', 'pt'],
  987: ['AR', 'es'],
  989: ['PT', 'pt'],
  9915: ['UY', 'es'],
  9917: ['BO', 'es'],
  9946: ['KP', 'ko'],
  9972: ['PE', 'es'],
  9974: ['UY', 'es'],
  99905: ['BO', 'es'],
  99954: ['BO', 'es'],
  99974: ['BO', 'es']
}

export function getIsbnCountry (isbn) {
  if (!validateIsbn(isbn)) {
    return null
  }

  isbn = isbn.replace(/-/g, '')
    .replace(/^97[8|9]/, '')

  const registrationGroups = Object.fromEntries(
    Object.entries(REGISTRATION_GROUPS)
      .map(([code, info]) => [
        code,
        {
          countryCode: info[0],
          locale: info[1],
          flagUrl: getFlagUrl(info[0])
        }
      ])
  )

  for (let i = 1; i <= 5; i++) {
    const group = isbn.substring(0, i)

    if (registrationGroups[group] !== undefined) {
      return registrationGroups[group]
    }
  }

  return null
}
