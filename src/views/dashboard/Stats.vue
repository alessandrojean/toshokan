<template>
  <div class="flex flex-col">
    <SimpleHeader
      :title="t('dashboard.stats.title')"
      :loading="loading"
      class="mb-3 md:mb-0"
    />

    <div class="flex-1">
      <div v-if="!sheetIsEmpty && !tooEarly" class="h-full flex flex-col max-w-7xl w-full mx-auto md:py-6 md:px-6 lg:px-8 space-y-6">
        <div class="space-y-3 sm:space-y-6 md:space-y-0 md:grid md:grid-cols-2 gap-6">
          <MonthlyExpenseChart />
          <MonthlyBoughtsChart />
        </div>

        <div class="space-y-3 sm:space-y-6 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <BasicBarChart
            :series="(stats.publishers || []).slice(0, 10)"
            :series-name="t('dashboard.stats.bookQuantity')"
            :title="t('dashboard.stats.publishersRankTitle')"
            :loading="loading"
          />
          <BasicBarChart
            :series="(stats.authors || []).slice(0, 10)"
            :series-name="t('dashboard.stats.bookQuantity')"
            :title="t('dashboard.stats.authorsRankTitle')"
            :loading="loading"
          />
          <BasicBarChart
            :series="(stats.series || []).slice(0, 10)"
            :series-name="t('dashboard.stats.bookQuantity')"
            :title="t('dashboard.stats.seriesRankTitle')"
            :loading="loading"
          />
        </div>
      </div>

      <!-- Empty collection -->
      <section
        v-if="sheetIsEmpty"
        aria-labelledby="empty-sheet-title"
        class="w-full max-w-lg mx-auto h-full flex items-center justify-center flex-col px-4"
      >
        <span aria-hidden="true">
          <ExclamationCircleIcon class="h-16 w-16 mb-8 text-gray-400 dark:text-gray-600" />
        </span>
        <h2
          id="empty-sheet-title"
          class="text-xl text-center font-medium text-gray-600 dark:text-gray-400 mb-2"
        >
          {{ t('dashboard.stats.empty.title') }}
        </h2>
        <p class="text-center text-gray-600 dark:text-gray-400 mb-8">
          {{ t('dashboard.stats.empty.description' )}}
        </p>
      </section>

      <!-- Too early for stats -->
      <section
        v-if="tooEarly"
        aria-labelledby="too-early-title"
        class="w-full max-w-lg mx-auto h-full flex items-center justify-center flex-col px-4"
      >
        <span aria-hidden="true">
          <PresentationChartLineIcon class="h-16 w-16 mb-8 text-gray-400 dark:text-gray-600" />
        </span>
        <h2
          id="too-early-title"
          class="text-xl text-center font-medium text-gray-600 dark:text-gray-400 mb-2"
        >
          {{ t('dashboard.stats.tooEarly.title') }}
        </h2>
        <p class="text-center text-gray-600 dark:text-gray-400 mb-8">
          {{ t('dashboard.stats.tooEarly.description') }}
        </p>
      </section>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import {
  ExclamationCircleIcon,
  PresentationChartLineIcon
} from '@heroicons/vue/outline'

import BasicBarChart from '@/components/BasicBarChart.vue'
import MonthlyBoughtsChart from '@/components/MonthlyBoughtsChart.vue'
import MonthlyExpenseChart from '@/components/MonthlyExpenseChart.vue'
import SimpleHeader from '@/components/SimpleHeader.vue'

export default {
  name: 'DashboardStats',

  components: {
    BasicBarChart,
    MonthlyBoughtsChart,
    MonthlyExpenseChart,
    SimpleHeader,
    ExclamationCircleIcon,
    PresentationChartLineIcon
  },

  setup () {
    const store = useStore()
    const router = useRouter()

    const loading = computed(() => store.state.sheet.loading)
    const sheetIsEmpty = computed(() => store.getters['sheet/sheetIsEmpty'])
    const tooEarly = computed(() => store.state.sheet.stats.monthly?.length === 1)
    const stats = computed(() => store.state.sheet.stats)

    const shared = computed(() => store.getters['sheet/shared'])

    function checkPermissions () {
      if (shared.value) {
        router.replace({ name: 'DashboardHome' })
      }
    }

    onMounted(() => checkPermissions())

    watch(shared, () => checkPermissions())

    const { t } = useI18n()

    return { loading, sheetIsEmpty, tooEarly, stats, t }
  }
}
</script>
