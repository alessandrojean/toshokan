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

const { t, d, locale } = useI18n({ useScope: 'global' })

const { darkMode } = useDarkMode()

const localeStr = computed(() => {
  return locale.value === 'en-US' ? 'en' : locale.value.toLowerCase()
})

const monthly = computed(() => (stats.value?.monthly || []).slice(-6))

const itemsBought = computed(() => ({
  options: {
    chart: {
      animations: { enabled: false },
      fontFamily: theme.fontFamily.sans.join(', '),
      id: 'monthly-boughts',
      locales: [apexLocales[locale.value]],
      defaultLocale: localeStr.value,
      selection: { enabled: false },
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    states: {
      active: { filter: { type: 'none' } }
    },
    colors: [theme.colors.primary[500], theme.colors.cyan[500]],
    fill: { opacity: 1.0 },
    grid: {
      borderColor: darkMode.value
        ? theme.colors.slate[600]
        : theme.colors.slate[200]
    },
    tooltip: { enabled: false },
    xaxis: {
      categories: monthly.value.map((m) => m.month.toISOString()),
      labels: {
        formatter: (_, timestamp) => {
          return d(new Date(timestamp), 'month')
        },
        hideOverlappingLabels: false,
        showDuplicates: true,
        style: {
          colors: darkMode.value
            ? theme.colors.slate[300]
            : theme.colors.slate[600]
        }
      }
    },
    yaxis: {
      labels: {
        formatter: (val) => val.toFixed(0),
        style: {
          colors: darkMode.value
            ? theme.colors.slate[300]
            : theme.colors.slate[600]
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
    dataLabels: {
      enabled: true,
      offsetY: -20,
      style: {
        colors: [
          darkMode.value ? theme.colors.slate[100] : theme.colors.slate[700]
        ]
      }
    },
    stroke: {
      show: true,
      colors: ['transparent'],
      width: 6
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 5,
        endingShape: 'rounded',
        dataLabels: {
          position: 'top',
          hideOverflowingLabels: false
        }
      }
    }
  },
  series: [
    {
      name: t('dashboard.stats.booksBoughtAndRead.bought'),
      data: monthly.value.map((m) => m.count)
    },
    {
      name: t('dashboard.stats.booksBoughtAndRead.read'),
      data: monthly.value.map((m) => m.read)
    }
  ]
}))
</script>

<template>
  <section
    class="bg-white dark:bg-gray-800 px-4 py-5 sm:p-6 md:rounded-md shadow space-y-2"
    :aria-labelledby="!loading ? 'monthly-boughts-title' : ''"
  >
    <div
      v-if="loading"
      class="motion-safe:animate-pulse h-5 bg-gray-400 dark:bg-gray-600 rounded w-40"
    ></div>
    <h2
      v-else
      id="monthly-boughts-title"
      class="text-lg font-medium font-display leading-6 text-gray-900 dark:text-gray-100"
    >
      {{ t('dashboard.stats.booksBoughtAndRead.title') }}
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
            type="bar"
            :options="itemsBought.options"
            :series="itemsBought.series"
          />
        </div>
      </FadeTransition>
    </div>
  </section>
</template>
