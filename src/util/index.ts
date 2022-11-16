import { inject, type InjectionKey } from 'vue'

export function getFlagUrl(countryCode: string) {
  return {
    circle: `https://hatscripts.github.io/circle-flags/flags/${countryCode.toLowerCase()}.svg`,
    rectangle: `https://purecatamphetamine.github.io/country-flag-icons/3x2/${countryCode.toUpperCase()}.svg`
  }
}

export function injectStrict<T>(key: InjectionKey<T>, defaultValue?: T) {
  const resolved = inject(key, defaultValue)

  if (!resolved) {
    throw new Error(`Could not resolve ${key.description}`)
  }

  return resolved
}
