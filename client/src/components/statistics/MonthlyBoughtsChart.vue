<script lang="ts" setup>
import type { UnwrapRef } from 'vue'
import type { ApexOptions } from 'apexcharts'

import { ChartBarIcon } from '@heroicons/vue/24/solid'

import apexEnUs from 'apexcharts/dist/locales/en.json'
import apexPtBr from 'apexcharts/dist/locales/pt-br.json'
import { type Locale, useI18n } from '@/i18n'

const apexLocales: Record<Locale, ApexLocale> = {
  'en-US': apexEnUs,
  'pt-BR': apexPtBr,
}

const ApexChart = defineAsyncComponent(() => import('vue3-apexcharts'))

const sheetStore = useSheetStore()
const { color, fontFamily } = useTailwindTheme()

const { data: stats, isLoading } = useStatisticsQuery({
  enabled: computed(() => sheetStore.sheetId !== null),
})

const loading = computed(() => isLoading.value)

const { t, d, locale } = useI18n({ useScope: 'global' })

const { darkMode } = useDarkMode()

const localeStr = computed(() => {
  return locale.value === 'en-US' ? 'en' : locale.value.toLowerCase()
})

const currentYear = new Date().getFullYear()

type MonthlyValues = NonNullable<UnwrapRef<typeof stats>>['monthly']

function fillMissingMonths(values: MonthlyValues, year: number) {
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
        read: 0,
      }
    }
  }

  return newValues
}

const currentYearValues = computed(() => {
  const values = (stats.value?.monthly ?? []).filter(
    m => m.month.getFullYear() === currentYear,
  )

  return fillMissingMonths(values, currentYear)
})

const itemsBought = computed(() => ({
  options: {
    chart: {
      animations: { enabled: false },
      fontFamily: fontFamily('sans')!.join(', '),
      id: 'monthly-boughts',
      locales: [apexLocales[locale.value as Locale]],
      defaultLocale: localeStr.value,
      selection: { enabled: false },
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    states: {
      active: { filter: { type: 'none' } },
    },
    colors: [color('primary', 500)!, color('cyan', 500)!],
    fill: { opacity: 1.0 },
    grid: {
      borderColor: darkMode.value ? color('slate', 600)! : color('slate', 200)!,
    },
    tooltip: { enabled: false },
    xaxis: {
      categories: currentYearValues.value.map(m => m.month.toISOString()),
      labels: {
        formatter: (_, timestamp) => {
          return d(new Date(timestamp!), 'month')
        },
        hideOverlappingLabels: false,
        showDuplicates: true,
        style: {
          colors: darkMode.value ? color('slate', 300) : color('slate', 600),
        },
      },
    },
    yaxis: {
      labels: {
        formatter: val => val.toFixed(0),
        style: {
          colors: darkMode.value ? color('slate', 300) : color('slate', 600),
        },
      },
      max: max => max + 1,
      forceNiceScale: true,
    },
    legend: {
      labels: {
        colors: darkMode.value ? color('slate', 300) : color('slate', 600),
        useSeriesColors: false,
      },
      onItemClick: {
        toggleDataSeries: false,
      },
    },
    dataLabels: {
      enabled: true,
      offsetY: -20,
      style: {
        colors: [darkMode.value ? color('slate', 100) : color('slate', 700)],
      },
    },
    stroke: {
      show: true,
      colors: ['transparent'],
      width: 6,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 5,
        // @ts-expect-error missing types
        endingShape: 'rounded',
        dataLabels: {
          position: 'top',
          hideOverflowingLabels: false,
        },
      },
    },
  } satisfies ApexOptions,
  series: [
    {
      name: t('dashboard.stats.booksBoughtAndRead.bought'),
      data: currentYearValues.value.map(m => m.count),
    },
    {
      name: t('dashboard.stats.booksBoughtAndRead.read'),
      data: currentYearValues.value.map(m => m.read),
    },
  ],
}))
</script>

<template>
  <DashboardBlock :title="t('dashboard.stats.booksBoughtAndRead.title')">
    <div class="bg-white dark:bg-gray-900 px-2 py-3 mt-4 rounded-lg">
      <div
        class="aspect-[16/10] md:aspect-[16/8] flex items-center justify-center"
        role="img"
      >
        <FadeTransition>
          <div v-if="loading" class="flex items-center justify-center">
            <ChartBarIcon
              class="motion-safe:animate-pulse w-10 h-10 text-gray-400 dark:text-gray-600"
              aria-hidden="true"
            />
          </div>
          <div v-else class="w-full h-full">
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
    </div>
  </DashboardBlock>
</template>
