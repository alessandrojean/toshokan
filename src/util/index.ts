export function getFlagUrl(countryCode: string) {
  return {
    circle: `https://hatscripts.github.io/circle-flags/flags/${countryCode.toLowerCase()}.svg`,
    rectangle: `http://purecatamphetamine.github.io/country-flag-icons/3x2/${countryCode.toUpperCase()}.svg`
  }
}
