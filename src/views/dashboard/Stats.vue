<script setup>
import { computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import { useSheetStore } from '@/stores/sheet'
import useStatisticsQuery from '@/queries/useStatisticsQuery'

import {
  ExclamationCircleIcon,
  PresentationChartLineIcon
} from '@heroicons/vue/outline'

import BasicBarChart from '@/components/BasicBarChart.vue'
import GroupedStatistics from '@/components/GroupedStatistics.vue'
import MonthlyBoughtsChart from '@/components/MonthlyBoughtsChart.vue'
import MonthlyExpenseChart from '@/components/MonthlyExpenseChart.vue'
import SimpleHeader from '@/components/SimpleHeader.vue'

const sheetStore = useSheetStore()
const router = useRouter()

const {
  data: stats,
  isLoading,
  isIdle
} = useStatisticsQuery({
  enabled: computed(() => sheetStore.sheetId !== null)
})

const loading = computed(() => isLoading.value || isIdle.value)

const sheetIsEmpty = computed(() => sheetStore.isEmpty)
const tooEarly = computed(() => stats.value?.monthly?.length === 1)

const shared = computed(() => sheetStore.shared)

function checkPermissions() {
  if (shared.value) {
    router.replace({ name: 'DashboardHome' })
  }
}

onMounted(() => checkPermissions())

watch(shared, () => checkPermissions())

const { t } = useI18n({ useScope: 'global' })
</script>

<template>
  <div class="flex flex-col">
    <SimpleHeader :title="t('dashboard.stats.title')" class="mb-3 md:mb-0" />

    <div class="flex-1">
      <div
        v-if="!sheetIsEmpty && !tooEarly"
        class="h-full flex flex-col max-w-7xl w-full mx-auto md:py-6 md:px-6 lg:px-8 space-y-1 md:space-y-6"
      >
        <GroupedStatistics class="mb-2 md:mb-0" />

        <div
          class="flex overflow-x-scroll md:overflow-x-visible pb-2 md:pb-0 snap-x snap-mandatory md:grid md:grid-cols-2 gap-6"
        >
          <MonthlyExpenseChart class="w-full shrink-0 snap-start" />
          <MonthlyBoughtsChart class="w-full shrink-0 snap-start" />
        </div>

        <div
          class="flex overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <BasicBarChart
            class="w-full shrink-0 snap-start"
            :series="(stats?.publishers || []).slice(0, 10)"
            :series-name="t('dashboard.stats.bookQuantity')"
            :title="t('dashboard.stats.publishersRankTitle')"
            :loading="loading"
          />
          <BasicBarChart
            class="w-full shrink-0 snap-start"
            :series="(stats?.authors || []).slice(0, 10)"
            :series-name="t('dashboard.stats.bookQuantity')"
            :title="t('dashboard.stats.authorsRankTitle')"
            :loading="loading"
          />
          <BasicBarChart
            class="w-full shrink-0 snap-start"
            :series="(stats?.series || []).slice(0, 10)"
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
          <ExclamationCircleIcon
            class="h-16 w-16 mb-8 text-gray-400 dark:text-gray-600"
          />
        </span>
        <h2
          id="empty-sheet-title"
          class="text-xl text-center font-medium text-gray-600 dark:text-gray-400 mb-2"
        >
          {{ t('dashboard.stats.empty.title') }}
        </h2>
        <p class="text-center text-gray-600 dark:text-gray-400 mb-8">
          {{ t('dashboard.stats.empty.description') }}
        </p>
      </section>

      <!-- Too early for stats -->
      <section
        v-if="tooEarly"
        aria-labelledby="too-early-title"
        class="w-full max-w-lg mx-auto h-full flex items-center justify-center flex-col px-4"
      >
        <span aria-hidden="true">
          <PresentationChartLineIcon
            class="h-16 w-16 mb-8 text-gray-400 dark:text-gray-600"
          />
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
