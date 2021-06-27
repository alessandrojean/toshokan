<template>
  <section class="bg-white dark:bg-gray-800 px-4 py-5 sm:p-6 rounded-md shadow space-y-2">
    <div v-if="loading" class="motion-safe:animate-pulse h-5 bg-gray-400 dark:bg-gray-600 rounded w-40"></div>
    <h3 v-else class="text-lg font-medium font-title leading-6 text-gray-900 dark:text-gray-100">
      Livros comprados
    </h3>
    <div class="aspect-w-16 aspect-h-10 md:aspect-h-6 sm:-mx-3">
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
import { computed } from 'vue'
import { useStore } from 'vuex'

import colors from 'tailwindcss/colors'

import useDarkMode from '@/composables/useDarkMode'
import useMotionSafe from '@/composables/useMotionSafe'

import { ChartBarIcon } from '@heroicons/vue/solid'

import VueApexCharts from 'vue3-apexcharts'

const ptBr = require('apexcharts/dist/locales/pt-br.json')

export default {
  components: {
    ApexChart: VueApexCharts,
    ChartBarIcon
  },

  setup () {
    const store = useStore()

    const loading = computed(() => store.state.sheet.loading)
    const stats = computed(() => store.state.sheet.stats)

    const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

    function parseDate (value) {
      const parts = value.split('. / ')
      return new Date(`${parts[1]}-${months.indexOf(parts[0]) + 1}`).toISOString()
    }

    const { darkMode } = useDarkMode()
    const { motionSafe } = useMotionSafe()

    const itemsBought = computed(() => ({
      options: {
        chart: {
          animations: {
            enabled: motionSafe.value
          },
          id: 'monthly-boughts',
          locales: [ptBr],
          defaultLocale: 'pt-br',
          toolbar: { show: false },
          zoom: { enabled: false }
        },
        colors: [colors.indigo[500]],
        fill: { opacity: 1.0 },
        grid: {
          borderColor: darkMode.value ? colors.gray[600] : colors.gray[200]
        },
        labels: stats.value.monthly.map(m => parseDate(m.month)),
        tooltip: { enabled: false },
        xaxis: {
          labels: {
            format: 'MMM',
            style: {
              colors: darkMode.value ? colors.gray[400] : colors.gray[500]
            }
          },
          type: 'datetime'
        },
        yaxis: {
          labels: {
            style: {
              colors: darkMode.value ? colors.gray[400] : colors.gray[500]
            }
          }
        },
        plotOptions: {
          bar: {
            horizontal: false,
            borderRadius: 5,
            dataLabels: {
              position: 'bottom'
            }
          }
        }
      },
      series: [
        {
          name: 'Livros comprados',
          data: stats.value.monthly.map(m => {
            return parseInt(
              m.count
                .replace(/\./g, '')
                .replace(',', '.')
            )
          })
        }
      ]
    }))

    return { loading, itemsBought }
  }
}
</script>
