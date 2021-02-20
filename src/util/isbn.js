export function convertIsbn13ToIsbn10 (isbn13) {
  const equalPart = isbn13.slice(3, -1)
  const sum = equalPart.split('')
    .map((d, i) => parseInt(d) * (i + 1))
    .reduce((acm, crr) => acm + crr, 0)
  const lastDigit = sum % 11

  return equalPart + (lastDigit === 10 ? 'X' : lastDigit)
}
