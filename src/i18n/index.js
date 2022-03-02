import { createI18n } from 'vue-i18n'

// Avoid lack of support to globEager when using Jest
// More info: https://github.com/vitejs/vite/issues/1149#issuecomment-775033930
const isTest = process.env.NODE_ENV === 'test'

const messageModules = !isTest && import.meta.globEager('./messages/*.js')
const datetimeModules = !isTest && import.meta.globEager('./datetime/*.js')
const numberModules = !isTest && import.meta.globEager('./number/*.js')

const replacingRegex = /^\.\/(.*)\/(.*)\.js$/

function mapToLocale(collection) {
  const fixedEntries = Object.entries(collection).map(([path, value]) => [
    path.replace(replacingRegex, '$2'),
    value.default
  ])

  return Object.fromEntries(fixedEntries)
}

const messages = isTest
  ? { 'en-US': require('@/i18n/messages/en-US').default }
  : mapToLocale(messageModules)
const datetimeFormats = isTest
  ? { 'en-US': require('@/i18n/datetime/en-US').default }
  : mapToLocale(datetimeModules)
const numberFormats = isTest
  ? { 'en-US': require('@/i18n/number/en-US').default }
  : mapToLocale(numberModules)

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
