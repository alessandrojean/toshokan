<script setup>
import { computed, defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'

import useDarkMode from '@/composables/useDarkMode'
import useTailwindTheme from '@/composables/useTailwindTheme'
import { useSheetStore } from '@/stores/sheet'
import useStatisticsQuery from '@/queries/useStatisticsQuery'

import { ChartBarIcon } from '@heroicons/vue/24/solid'

import FadeTransition from './transitions/FadeTransition.vue'

import apexEnUs from 'apexcharts/dist/locales/en.json'
import apexPtBr from 'apexcharts/dist/locales/pt-br.json'

const apexLocales = {
  'en-US': apexEnUs,
  'pt-BR': apexPtBr
}

const ApexChart = defineAsyncComponent(() => import('vue3-apexcharts'))

const sheetStore = useSheetStore()
const { theme } = useTailwindTheme()

const {
  data: stats,
  isLoading,
  isIdle
} = useStatisticsQuery({
  enabled: computed(() => sheetStore.sheetId !== null)
})

const loading = computed(() => isLoading.value || isIdle.value)

const { n, t, d, locale } = useI18n({ useScope: 'global' })

const localeStr = computed(() => {
  return locale.value === 'en-US' ? 'en' : locale.value.toLowerCase()
})

const { darkMode } = useDarkMode()

const currentYear = new Date().getFullYear()
const pastYear = currentYear - 1

function fillMissingMonths(values, year) {
  const newValues = []

  for (const m of values) {
    newValues[m.month.getMonth()] = m
  }

  for (let i = 0; i < newValues.length; i++) {
    if (newValues[i] === undefined) {
      newValues[i] = {
        month: new Date(`${year}-${String(i + 1).padStart(2, '0')}-02`),
        totalSpent: 0,
        count: 0,
        read: 0
      }
    }
  }

  return newValues
}

const currentYearValues = computed(() => {
  const values = (stats.value?.monthly || []).filter(
    (m) => m.month.getFullYear() === currentYear
  )

  return fillMissingMonths(values, currentYear)
})

const pastYearValues = computed(() => {
  const values = (stats.value?.monthly || []).filter(
    (m) => m.month.getFullYear() === pastYear
  )

  const lastMonth = currentYearValues.value.length
  return fillMissingMonths(values, pastYear).slice(0, lastMonth)
})

const expenses = computed(() => ({
  options: {
    chart: {
      animations: { enabled: false },
      fontFamily: theme.fontFamily.sans.join(', '),
      id: 'monthly-expenses',
      locales: [apexLocales[locale.value]],
      defaultLocale: localeStr.value,
      selection: { enabled: false },
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    colors: [theme.colors.cyan[500], theme.colors.primary[500]],
    dataLabels: { enabled: false },
    grid: {
      borderColor: darkMode.value
        ? theme.colors.slate[600]
        : theme.colors.slate[200]
    },
    stroke: { curve: 'smooth' },
    tooltip: {
      theme: darkMode.value ? 'dark' : 'light',
      x: {
        formatter: (value) => {
          return d(currentYearValues.value[value - 1].month, 'monthYear')
        }
      }
    },
    xaxis: {
      categories: currentYearValues.value.map((m) => m.month.toISOString()),
      labels: {
        formatter: (value) => {
          return value ? d(new Date(value), 'month') : value
        },
        style: {
          colors: darkMode.value
            ? theme.colors.slate[300]
            : theme.colors.slate[600]
        }
      },
      tooltip: { enabled: false }
    },
    yaxis: {
      labels: {
        formatter: (value) => {
          return n(value, 'currency', {
            currency: stats.value.money?.currency || 'USD'
          })
        },
        style: {
          colors: darkMode.value
            ? theme.colors.slate[300]
            : theme.colors.slate[600]
        }
      }
    }
  },
  legend: {
    labels: {
      colors: darkMode.value
        ? theme.colors.slate[300]
        : theme.colors.slate[600],
      useSeriesColors: false
    },
    onItemClick: {
      toggleDataSeries: false
    }
  },
  series: [
    {
      name: t('dashboard.stats.monthlyExpense', { year: pastYear }),
      data: pastYearValues.value.map((m) => m.totalSpent)
    },
    {
      name: t('dashboard.stats.monthlyExpense', { year: currentYear }),
      data: currentYearValues.value.map((m) => m.totalSpent)
    }
  ]
}))
</script>

<template>
  <section
    class="bg-white dark:bg-gray-800 md:rounded-2xl shadow"
    :aria-labelledby="!loading ? 'monthly-expense-title' : ''"
  >
    <div class="px-4 sm:px-6 py-3 border-b dark:border-b-gray-700">
      <div v-if="loading" class="skeleton h-6 w-40" />
      <h2
        v-else
        id="monthly-expense-title"
        class="font-medium font-display text-gray-900 dark:text-gray-100"
      >
        {{ t('dashboard.stats.monthlyExpenseTitle') }}
      </h2>
    </div>
    <div class="px-4 py-3 sm:px-6">
      <div class="aspect-w-16 aspect-h-10 md:aspect-h-7 sm:-mx-3" role="img">
        <FadeTransition>
          <div v-if="loading" class="flex items-center justify-center">
            <ChartBarIcon
              class="motion-safe:animate-pulse w-10 h-10 text-gray-400 dark:text-gray-600"
              aria-hidden="true"
            />
          </div>
          <div v-else class="monthly-expense-chart">
            <ApexChart
              width="100%"
              height="100%"
              type="area"
              :options="expenses.options"
              :series="expenses.series"
            />
          </div>
        </FadeTransition>
      </div>
    </div>
  </section>
</template>

<style lang="postcss">
.monthly-expense-chart
  .apexcharts-legend
  .apexcharts-legend-series
  .apexcharts-legend-text {
  @apply !text-gray-600 dark:!text-gray-300;
}
</style>
