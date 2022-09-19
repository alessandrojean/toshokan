<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useSheetStore } from '@/stores/sheet'
import useStatisticsQuery from '@/queries/useStatisticsQuery'

import {
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon
} from '@heroicons/vue/20/solid'

const { t, n } = useI18n()
const sheetStore = useSheetStore()

const {
  data: stats,
  isLoading,
  isIdle
} = useStatisticsQuery({
  enabled: computed(() => sheetStore.sheetId !== null)
})

const loading = computed(() => isLoading.value || isIdle.value)

const currency = computed(() => stats.value?.money.currency)

function percentageIncrease(final, starting) {
  if (!final || !starting) {
    return null
  }

  const percentage = (final - starting) / starting

  return {
    percentage,
    absPercentage: Math.abs(percentage),
    increased: percentage > 0
  }
}

const monthlyReversed = computed(() => stats.value?.monthly.slice().reverse())

const groups = computed(() => [
  {
    label: t('dashboard.stats.count'),
    current: stats.value?.count,
    integer: true
  },
  {
    label: t('dashboard.stats.thisMonth'),
    current: monthlyReversed.value?.[0]?.totalSpent,
    previous: monthlyReversed.value?.[1]?.totalSpent,
    percentage: percentageIncrease(
      monthlyReversed.value?.[0]?.totalSpent,
      monthlyReversed.value?.[1]?.totalSpent
    ),
    currency: true,
    inverted: true
  },
  {
    label: t('dashboard.stats.bought'),
    current: monthlyReversed.value?.[0]?.count,
    previous: monthlyReversed.value?.[1]?.count,
    percentage: percentageIncrease(
      monthlyReversed.value?.[0]?.count,
      monthlyReversed.value?.[1]?.count
    )
  },
  {
    label: t('dashboard.stats.read'),
    current: monthlyReversed.value?.[0]?.read,
    previous: monthlyReversed.value?.[1]?.read,
    percentage: percentageIncrease(
      monthlyReversed.value?.[0]?.read,
      monthlyReversed.value?.[1]?.read
    )
  }
])
</script>

<template>
  <section
    class="grid grid-cols-2 md:grid-cols-4 bg-white dark:bg-gray-800 md:rounded-2xl shadow divide-x dark:divide-gray-700"
  >
    <template v-if="!loading">
      <div
        v-for="(group, idx) of groups"
        :key="group.label"
        :class="idx < 2 ? 'border-b dark:border-b-gray-700 md:border-b-0' : ''"
        class="px-4 sm:px-6 py-4"
      >
        <h3
          class="text-xs md:text-sm font-medium font-display dark:text-gray-200"
        >
          {{ group.label }}
        </h3>
        <div class="mt-0.5 flex items-center justify-between">
          <p>
            <span
              class="sm:text-lg md:text-xl lg:text-2xl font-semibold text-primary-700 dark:text-primary-400 shrink-0"
            >
              {{
                n(
                  group.current ?? 0,
                  group.currency ? 'currency' : 'integer',
                  group.currency ? { currency: currency ?? 'USD' } : undefined
                )
              }}
            </span>
            <span
              v-if="!group.currency"
              class="ml-2 text-xs lg:text-sm font-medium text-gray-600 dark:text-gray-400"
            >
              {{ t('dashboard.stats.book', group.current) }}
            </span>
          </p>
          <span
            v-if="(group.percentage?.percentage || 0) !== 0"
            :class="[
              'flex items-center text-xxs lg:text-xs font-semibold tracking-wide uppercase px-2 py-0.5 lg:py-1 rounded-full shrink-0',
              group.percentage?.increased !== !!group.inverted
                ? 'bg-green-100 dark:bg-green-600/40 text-green-800 dark:text-green-200'
                : 'bg-red-100 dark:bg-red-700/40 text-red-800 dark:text-red-200'
            ]"
          >
            <span aria-hidden="true">
              <ArrowTrendingUpIcon
                v-if="group.percentage?.increased"
                class="w-2.5 lg:w-3.5 h-2.5 lg:h-3.5 mr-1"
              />
              <ArrowTrendingDownIcon
                v-else
                class="w-2.5 lg:w-3.5 h-2.5 lg:h-3.5 mr-1"
              />
            </span>
            {{ n(group.percentage.absPercentage, 'percent') }}
          </span>
        </div>
      </div>
    </template>
    <template v-else>
      <div
        v-for="(group, idx) in groups"
        :key="group.label"
        :class="idx < 2 ? 'border-b dark:border-b-gray-700 md:border-b-0' : ''"
        class="p-4"
      >
        <div class="skeleton h-4 md:h-5 w-24" />
        <div class="mt-1 flex items-center justify-between">
          <div class="skeleton h-6 lg:h-8 w-16 sm:w-36 md:w-20 lg:w-36" />
          <div
            v-if="!group.integer"
            class="skeleton h-5 lg:h-6 w-14 lg:w-16 rounded-full"
          />
        </div>
      </div>
    </template>
  </section>
</template>
