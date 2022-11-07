import {
  DefineDateTimeFormat,
  DefineNumberFormat,
  Locale,
  UseI18nOptions
} from 'vue-i18n'

declare module 'vue-i18n' {
  export interface DefineDateTimeFormat {
    short: Intl.DateTimeFormatOptions
    long: Intl.DateTimeFormatOptions
    sheet: Intl.DateTimeFormatOptions
    month: Intl.DateTimeFormatOptions
    monthYear: Intl.DateTimeFormatOptions
  }

  export interface DefineNumberFormat {
    currency: Intl.NumberFormatOptions
    dimensions: Intl.NumberFormatOptions
    decimal: Intl.NumberFormatOptions
    integer: Intl.NumberFormatOptions
    percent: Intl.NumberFormatOptions
  }

  namespace UseI18nOptions {
    type Locale = 'en-US' | 'pt-BR'
  }

  // export type Locale = 'en-US' | 'pt-BR'
}
