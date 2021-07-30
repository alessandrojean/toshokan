<template>
  <section
    class="bg-white dark:bg-gray-800 px-4 py-5 sm:p-6 md:rounded-md shadow space-y-2"
    :aria-labelledby="!loading ? 'monthly-expense-title' : ''"
  >
    <div v-if="loading" class="motion-safe:animate-pulse h-5 bg-gray-400 dark:bg-gray-600 rounded w-40"></div>
    <h3 v-else id="monthly-expense-title" class="text-lg font-medium font-title leading-6 text-gray-900 dark:text-gray-100">
      {{ t('dashboard.stats.monthlyExpense') }}
    </h3>
    <div class="aspect-w-16 aspect-h-10 md:aspect-h-6 sm:-mx-3" role="img" aria-label="Gráfico do gasto mensal">
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
            type="area"
            :options="expenses.options"
            :series="expenses.series"
          />
        </div>
      </transition>
    </div>
  </section>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

import colors from 'tailwindcss/colors'

import useDarkMode from '@/composables/useDarkMode'
import useMotionSafe from '@/composables/useMotionSafe'

import { ChartBarIcon } from '@heroicons/vue/solid'

import VueApexCharts from 'vue3-apexcharts'

export default {
  components: {
    ApexChart: VueApexCharts,
    ChartBarIcon
  },

  setup () {
    const store = useStore()

    const loading = computed(() => store.state.sheet.loading)
    const stats = computed(() => store.state.sheet.stats)

    const { n, t, locale } = useI18n()

    const { darkMode } = useDarkMode()
    const { motionSafe } = useMotionSafe()

    const localeStr = computed(() => {
      return locale.value === 'en-US' ? 'en' : locale.value.toLowerCase()
    })

    const apexLocale = computed(() => {
      return require('apexcharts/dist/locales/' + localeStr.value + '.json')
    })

    const expenses = computed(() => ({
      options: {
        chart: {
          animations: {
            enabled: motionSafe.value
          },
          id: 'monthly-expenses',
          locales: [apexLocale.value],
          defaultLocale: localeStr.value,
          toolbar: { show: false },
          zoom: { enabled: false }
        },
        colors: [colors.indigo[500]],
        dataLabels: { enabled: false },
        grid: {
          borderColor: darkMode.value ? colors.gray[600] : colors.gray[200]
        },
        stroke: { curve: 'smooth' },
        labels: (stats.value.monthly || []).map(m => m.month.toISOString()),
        tooltip: {
          theme: darkMode.value ? 'dark' : 'light',
          x: { format: 'MMMMM/yyyy' }
        },
        xaxis: {
          labels: {
            format: 'MMM',
            style: {
              colors: darkMode.value ? colors.gray[400] : colors.gray[500]
            }
          },
          type: 'datetime',
          tooltip: { enabled: false }
        },
        yaxis: {
          labels: {
            formatter: value => {
              return n(value, 'currency', {
                currency: stats.value.money?.currency || 'USD'
              })
            },
            style: {
              colors: darkMode.value ? colors.gray[400] : colors.gray[500]
            }
          }
        }
      },
      series: [
        {
          name: t('dashboard.stats.monthlyExpense'),
          data: (stats.value.monthly || []).map(m => m.totalSpent)
        }
      ]
    }))

    return { loading, expenses, t }
  }
}
</script>
