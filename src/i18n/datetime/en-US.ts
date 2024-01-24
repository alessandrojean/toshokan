import type { DefaultDateTimeFormatSchema } from 'vue-i18n'

export default <DefaultDateTimeFormatSchema>{
  short: {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  },
  long: {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  },
  sheet: {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  },
  dayMonth: {
    day: '2-digit',
    month: 'short',
  },
  month: {
    month: 'short',
  },
  monthYear: {
    month: 'long',
    year: 'numeric',
  },
}
