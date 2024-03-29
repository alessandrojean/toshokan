import {
  createI18n,
  useI18n as useI18nBroken,
} from 'vue-i18n'
import type {
  DefaultDateTimeFormatSchema,
  DefaultNumberFormatSchema,
  UseI18nOptions,
} from 'vue-i18n'

import messages from '@intlify/unplugin-vue-i18n/messages'
import type { Ref } from 'vue'

const isTest = !!import.meta.vitest

const datetimeModules = import.meta.glob<DefaultDateTimeFormatSchema>(
  './datetime/*.ts',
  { eager: true },
)
const numberModules = import.meta.glob<DefaultNumberFormatSchema>(
  './number/*.ts',
  { eager: true },
)

const replacingRegex = /^\.\/(.*)\/(.*)\.ts$/

export type Locale = 'en-US' | 'pt-BR'

function mapToLocale<T>(collection: Record<string, T>): Record<Locale, T> {
  const fixedEntries = Object.entries(collection).map(([path, value]) => [
    path.replace(replacingRegex, '$2'),
    // @ts-expect-error missing types
    value.default,
  ])

  return Object.fromEntries(fixedEntries)
}

const datetimeFormats = mapToLocale(datetimeModules)
const numberFormats = mapToLocale(numberModules)

const navigatorLanguage = navigator.language
const userLocale = !isTest
  ? localStorage.getItem('locale') ?? navigatorLanguage
  : 'en-US'

const locale: Locale = messages![userLocale] ? (userLocale as Locale) : 'en-US'

document.documentElement.lang = locale

export default createI18n<object, Locale>({
  legacy: false,
  locale,
  fallbackLocale: 'en-US',
  datetimeFormats,
  numberFormats,
  messages: messages as Record<Locale, any>,
})

useI18nBroken

export function useI18n(options: UseI18nOptions) {
  const i18n = useI18nBroken(options)

  return {
    ...i18n,
    locale: i18n.locale as Ref<Locale>,
  }
}
