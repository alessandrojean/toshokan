import { createI18n } from 'vue-i18n'

import messages from '@intlify/vite-plugin-vue-i18n/messages'

const isTest = !!import.meta.vitest

const datetimeModules = import.meta.globEager('./datetime/*.js')
const numberModules = import.meta.globEager('./number/*.js')

const replacingRegex = /^\.\/(.*)\/(.*)\.js$/

function mapToLocale(collection) {
  const fixedEntries = Object.entries(collection).map(([path, value]) => [
    path.replace(replacingRegex, '$2'),
    value.default
  ])

  return Object.fromEntries(fixedEntries)
}

const datetimeFormats = mapToLocale(datetimeModules)
const numberFormats = mapToLocale(numberModules)

const navigatorLanguage = navigator.language || navigator.userLanguage
const userLocale = !isTest
  ? localStorage.getItem('locale') || navigatorLanguage
  : 'en-US'

const locale = messages[userLocale] ? userLocale : 'en-US'

document.documentElement.lang = locale

export default createI18n({
  legacy: false,
  locale,
  fallbackLocale: 'en-US',
  datetimeFormats,
  numberFormats,
  messages
})
