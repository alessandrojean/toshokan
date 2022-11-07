<script lang="ts" setup>
import { computed, defineAsyncComponent, toRefs } from 'vue'
import type { ApexOptions } from 'apexcharts'

import useDarkMode from '@/composables/useDarkMode'
import useTailwindTheme from '@/composables/useTailwindTheme'
import { type Locale, useI18n } from '@/i18n'

import { ChartBarIcon } from '@heroicons/vue/24/solid'

import FadeTransition from './transitions/FadeTransition.vue'

import apexEnUs from 'apexcharts/dist/locales/en.json'
import apexPtBr from 'apexcharts/dist/locales/pt-br.json'

const ApexChart = defineAsyncComponent(() => import('vue3-apexcharts'))

const apexLocales: Record<Locale, ApexLocale> = {
  'en-US': apexEnUs,
  'pt-BR': apexPtBr
}

const props = defineProps<{
  loading?: boolean
  series: any[]
  seriesName: string
  title: string
}>()

const { locale } = useI18n({ useScope: 'global' })

const { darkMode } = useDarkMode()
const { color, fontFamily } = useTailwindTheme()

const localeStr = computed(() => {
  return locale.value === 'en-US' ? 'en' : locale.value.toLowerCase()
})

const { series, seriesName } = toRefs(props)

const plot = computed(() => ({
  options: <ApexOptions>{
    chart: {
      animations: { enabled: false },
      fontFamily: fontFamily('sans')!.join(', '),
      locales: [apexLocales[locale.value]],
      defaultLocale: localeStr.value,
      selection: { enabled: false },
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    colors: [color('primary', 500)!],
    fill: { opacity: 1.0 },
    grid: {
      borderColor: darkMode.value ? color('slate', 600)! : color('slate', 200)!,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } }
    },
    tooltip: {
      theme: darkMode.value ? 'dark' : 'light',
      y: {
        formatter: (val) => val.toFixed(0)
      }
    },
    xaxis: {
      categories: series.value.map((s) => s.name),
      labels: {
        formatter: (val) => Number(val).toFixed(0),
        hideOverlappingLabels: false,
        showDuplicates: true,
        style: {
          colors: darkMode.value ? color('slate', 300)! : color('slate', 600)!
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: darkMode.value ? color('slate', 300)! : color('slate', 600)!
        }
      }
    },
    legend: {
      labels: {
        colors: darkMode.value ? color('slate', 300)! : color('slate', 600)!,
        useSeriesColors: false
      },
      onItemClick: {
        toggleDataSeries: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      colors: ['transparent'],
      width: 6
    },
    plotOptions: {
      bar: {
        horizontal: true,
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
      name: seriesName.value,
      data: series.value.map((s) => s.count)
    }
  ]
}))
</script>

<template>
  <section class="bg-white dark:bg-gray-800 md:rounded-2xl shadow">
    <div class="px-4 sm:px-6 py-3 border-b dark:border-b-gray-700">
      <div v-if="loading" class="skeleton h-6 w-40" />
      <h2
        v-else
        class="font-medium font-display leading-6 text-gray-900 dark:text-gray-100"
      >
        {{ title }}
      </h2>
    </div>
    <div class="px-4 py-3 sm:px-6">
      <div class="aspect-w-3 aspect-h-4 sm:-mt-4" role="img">
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
              :options="plot.options"
              :series="plot.series"
            />
          </div>
        </FadeTransition>
      </div>
    </div>
  </section>
</template>
