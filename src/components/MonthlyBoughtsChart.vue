<template>
  <section
    class="bg-white dark:bg-gray-800 px-4 py-5 sm:p-6 md:rounded-md shadow space-y-2"
    :aria-labelledby="!loading ? 'monthly-boughts-title' : ''"
  >
    <div v-if="loading" class="motion-safe:animate-pulse h-5 bg-gray-400 dark:bg-gray-600 rounded w-40"></div>
    <h3 v-else id="monthly-boughts-title" class="text-lg font-medium font-display leading-6 text-gray-900 dark:text-gray-100">
      {{ t('dashboard.stats.booksBoughtAndRead.title') }}
    </h3>
    <div class="aspect-w-16 aspect-h-10 md:aspect-h-6 sm:-mx-3" role="img">
      <transition
        mode="out-in"
        enter-active-class="transition motion-reduce:transition-none duration-500 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100 "
        leave-active-class="transition motion-reduce:transition-none duration-300 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="loading" class="flex items-center justify-center">
          <ChartBarIcon class="motion-safe:animate-pulse w-10 h-10 text-gray-400 dark:text-gray-600" aria-hidden="true" />
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
      </transition>
    </div>
  </section>
</template>

<script>
import { computed, defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'

import colors from 'tailwindcss/colors'

import useDarkMode from '@/composables/useDarkMode'
import useMotionSafe from '@/composables/useMotionSafe'
import { useSheetStore } from '@/stores/sheet'

import { ChartBarIcon } from '@heroicons/vue/solid'

import apexEnUs from 'apexcharts/dist/locales/en.json'
import apexPtBr from 'apexcharts/dist/locales/pt-br.json'

const apexLocales = {
  'en-US': apexEnUs,
  'pt-BR': apexPtBr
}

export default {
  components: {
    ApexChart: defineAsyncComponent(() => import('vue3-apexcharts')),
    ChartBarIcon
  },

  setup () {
    const sheetStore = useSheetStore()

    const loading = computed(() => sheetStore.loading)
    const stats = computed(() => sheetStore.stats)

    const { t, d, locale } = useI18n({ useScope: 'global' })

    const { darkMode } = useDarkMode()
    const { motionSafe } = useMotionSafe()

    const localeStr = computed(() => {
      return locale.value === 'en-US' ? 'en' : locale.value.toLowerCase()
    })

    const monthly = computed(() => (stats.value.monthly || []).slice(-6))

    const itemsBought = computed(() => ({
      options: {
        chart: {
          animations: {
            enabled: motionSafe.value
          },
          id: 'monthly-boughts',
          locales: [apexLocales[locale.value]],
          defaultLocale: localeStr.value,
          toolbar: { show: false },
          zoom: { enabled: false }
        },
        colors: [colors.indigo[500], colors.indigo[300]],
        fill: { opacity: 1.0 },
        grid: {
          borderColor: darkMode.value ? colors.slate[600] : colors.slate[200]
        },
        tooltip: { enabled: false },
        xaxis: {
          categories: monthly.value.map(m => m.month.toISOString()),
          labels: {
            formatter: (_, timestamp) => {
              return d(new Date(timestamp), 'month')
            },
            hideOverlappingLabels: false,
            showDuplicates: true,
            style: {
              colors: darkMode.value ? colors.slate[300] : colors.slate[600]
            }
          }
        },
        yaxis: {
          labels: {
            formatter: val => val.toFixed(0),
            style: {
              colors: darkMode.value ? colors.slate[300] : colors.slate[600]
            }
          }
        },
        legend: {
          labels: {
            colors: darkMode.value ? colors.slate[300] : colors.slate[600],
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
            colors: [darkMode.value ? colors.slate[100] : colors.slate[700]]
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
          data: monthly.value.map(m => m.count)
        },
        {
          name: t('dashboard.stats.booksBoughtAndRead.read'),
          data: monthly.value.map(m => m.read)
        }
      ]
    }))

    return { loading, itemsBought, t }
  }
}
</script>
