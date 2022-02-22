import { decimalComma, ean, isbn, isoDate, issn } from '@/util/validators'

describe('Decimal number', () => {
  const instance = decimalComma(2)

  it('Should pass on a valid number', () => {
    expect(instance('2,90')).toBe(true)
    expect(instance('2.9')).toBe(true)
    expect(instance('2')).toBe(true)
  })

  it('Should fail on a invalid number', () => {
    expect(instance('2,')).toBe(false)
    expect(instance('2,A')).toBe(false)
    expect(instance('ABC')).toBe(false)
    expect(instance('2,934')).toBe(false)
  })
})

describe('ISBN', () => {
  it('Should pass on a valid ISBN', () => {
    expect(isbn('9788545702870')).toBe(true)
    expect(isbn('978-85-4570-232-0')).toBe(true)
    expect(isbn('8576161877')).toBe(true)
  })

  it('Should fail on a invalid ISBN', () => {
    expect(isbn()).toBe(false)
    expect(isbn('')).toBe(false)
    expect(isbn('1234')).toBe(false)
    expect(isbn('978-85-4570-288-9')).toBe(false)
  })
})

describe('ISSN', () => {
  it('Should pass on a valid ISSN', () => {
    expect(issn('20493630')).toBe(true)
    expect(issn('2434-561X')).toBe(true)
  })

  it('Should fail on a invalid ISBN', () => {
    expect(issn()).toBe(false)
    expect(issn('')).toBe(false)
    expect(issn('1234')).toBe(false)
    expect(issn('7897780166667')).toBe(false)
    expect(issn('9788545702889')).toBe(false)
    expect(issn('2434-5612')).toBe(false)
  })
})

describe('EAN-13', () => {
  it('Should pass on a valid EAN-13', () => {
    expect(ean('7897653521036')).toBe(true)
    expect(ean('7897780166667')).toBe(true)
  })

  it('Should fail on a invalid EAN-13', () => {
    expect(ean()).toBe(false)
    expect(ean('')).toBe(false)
    expect(ean('1234')).toBe(false)
    expect(ean('7897780166668')).toBe(false)
  })
})

describe('ISO Date', () => {
  it('Should pass on a valid date', () => {
    expect(isoDate('2022-02-23')).toBe(true)
    expect(isoDate('2022-2-23')).toBe(true)
    expect(isoDate('2022-02-1')).toBe(true)
    expect(isoDate('2022-02', true)).toBe(true)
    expect(isoDate('2022', true)).toBe(true)
  })

  it('Should fail on a invalid date', () => {
    expect(isoDate('2022-02-29')).toBe(false)
    expect(isoDate('2022-02-AA')).toBe(false)
    expect(isoDate('2022-13-20')).toBe(false)
    expect(isoDate('3001-02-20')).toBe(false)
    expect(isoDate('2022-12')).toBe(false)
    expect(isoDate('2022')).toBe(false)
    expect(isoDate('2022-13-20', true)).toBe(false)
    expect(isoDate('2022-13', true)).toBe(false)
    expect(isoDate('202A', true)).toBe(false)
    expect(isoDate('3001', true)).toBe(false)
    expect(isoDate('')).toBe(false)
    expect(isoDate()).toBe(false)
    expect(isoDate(new Date())).toBe(false)
  })
})
