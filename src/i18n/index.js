import { createI18n } from 'vue-i18n'

import enUs from './messages/en-US'
import ptBr from './messages/pt-BR'

const datetimeFormats = {
  'en-US': {
    short: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    },
    long: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    },
    sheet: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23'
    },
    month: {
      month: 'short'
    },
    monthYear: {
      month: 'long',
      year: 'numeric'
    }
  },
  'pt-BR': {
    short: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    },
    long: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    },
    sheet: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    },
    month: {
      month: 'short'
    },
    monthYear: {
      month: 'long',
      year: 'numeric'
    }
  }
}

const numberFormats = {
  'en-US': {
    currency: {
      style: 'currency',
      currency: 'USD',
      notation: 'standard'
    },
    format: {
      style: 'decimal',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
      useGrouping: false
    },
    decimal: {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: false
    },
    integer: {
      useGrouping: true
    },
    percent: {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
      useGrouping: false
    }
  },
  'pt-BR': {
    currency: {
      style: 'currency',
      currency: 'BRL',
      notation: 'standard'
    },
    format: {
      style: 'decimal',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
      useGrouping: false
    },
    decimal: {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: false
    },
    integer: {
      useGrouping: true
    },
    percent: {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
      useGrouping: false
    }
  }
}

const messages = {
  'en-US': enUs,
  'pt-BR': ptBr
}

const navigatorLanguage = navigator.language || navigator.userLanguage
const userLocale = localStorage.getItem('locale') || navigatorLanguage

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
