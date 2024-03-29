import type { DefaultNumberFormatSchema } from 'vue-i18n'

export default <DefaultNumberFormatSchema>{
  currency: {
    style: 'currency',
    // currency: 'BRL',
    notation: 'standard',
  },
  dimensions: {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
    useGrouping: false,
  },
  decimal: {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: false,
  },
  integer: {
    useGrouping: true,
  },
  percent: {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
    useGrouping: false,
  },
}
