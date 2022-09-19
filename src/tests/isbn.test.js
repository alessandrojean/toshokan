import { it, expect } from 'vitest'

import { convertIsbn13ToIsbn10, getIsbnCountry } from '@/util/isbn'

it('Should convert an ISBN-13 to ISBN-10 correctly', () => {
  expect(convertIsbn13ToIsbn10('9788545702320')).toBe('8545702329')
  expect(convertIsbn13ToIsbn10('9786555942521')).toBe('6555942525')
  expect(convertIsbn13ToIsbn10('8576161877')).toBe('8576161877')
  expect(convertIsbn13ToIsbn10('1234')).toBeNull()
})

it('Should compute the ISBN data correctly', () => {
  expect(getIsbnCountry('9788545702870')).toMatchObject({
    countryCode: 'BR',
    locale: 'pt-BR'
  })

  expect(getIsbnCountry('9786555942521')).toMatchObject({
    countryCode: 'BR',
    locale: 'pt-BR'
  })

  expect(getIsbnCountry('9789895595143')).toMatchObject({
    countryCode: 'PT',
    locale: 'pt'
  })

  expect(getIsbnCountry('9788416693702')).toMatchObject({
    countryCode: 'ES',
    locale: 'es'
  })

  expect(getIsbnCountry('1234')).toBeNull()
})
