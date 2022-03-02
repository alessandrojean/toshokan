<script setup>
import { computed, defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'

import useDarkMode from '@/composables/useDarkMode'
import useTailwindTheme from '@/composables/useTailwindTheme'
import { useSheetStore } from '@/stores/sheet'
import useStatisticsQuery from '@/queries/useStatisticsQuery'

import { ChartBarIcon } from '@heroicons/vue/solid'

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
    colors: [theme.colors.primary[500]],
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
          return d(stats.value.monthly[value - 1].month, 'monthYear')
        }
      }
    },
    xaxis: {
      categories: (stats.value?.monthly || []).map((m) =>
        m.month.toISOString()
      ),
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
  series: [
    {
      name: t('dashboard.stats.monthlyExpense'),
      data: (stats.value?.monthly || []).map((m) => m.totalSpent)
    }
  ]
}))
</script>

<template>
  <section
    class="bg-white dark:bg-gray-800 px-4 py-5 sm:p-6 md:rounded-md shadow space-y-2"
    :aria-labelledby="!loading ? 'monthly-expense-title' : ''"
  >
    <div
      v-if="loading"
      class="motion-safe:animate-pulse h-5 bg-gray-400 dark:bg-gray-600 rounded w-40"
    ></div>
    <h2
      v-else
      id="monthly-expense-title"
      class="text-lg font-medium font-display leading-6 text-gray-900 dark:text-gray-100"
    >
      {{ t('dashboard.stats.monthlyExpense') }}
    </h2>
    <div class="aspect-w-16 aspect-h-10 md:aspect-h-6 sm:-mx-3" role="img">
      <FadeTransition>
        <div v-if="loading" class="flex items-center justify-center">
          <ChartBarIcon
            class="motion-safe:animate-pulse w-10 h-10 text-gray-400 dark:text-gray-600"
            aria-hidden="true"
          />
        </div>
        <div v-else>
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
  </section>
</template>
