<script lang="ts" setup>
import type { RankingItem } from '@/services/sheet/getStatistics'
import { useI18n } from '@/i18n'

export interface StatisticsRankingProps {
  loading?: boolean
  ranking?: RankingItem[]
  title: string
}

const props = withDefaults(defineProps<StatisticsRankingProps>(), {
  loading: false,
  ranking: () => []
})

const { loading, ranking, title } = toRefs(props)
const { t, n } = useI18n({ useScope: 'global' })
</script>

<template>
  <section class="bg-block dark:bg-block-dark p-4 rounded-xl">
    <h3
      class="font-display font-medium text-md sm:text-lg text-gray-900 dark:text-gray-100"
    >
      {{ title }}
    </h3>

    <ol v-if="!loading" class="mt-4 divide-y dark:divide-gray-700">
      <li v-for="(item, i) of ranking" :key="item.name" class="py-2.5 relative">
        <span
          aria-hidden="true"
          class="select-none absolute right-1 inset-y-0 flex items-center text-6xl leading-none italic font-display tracking-tighter text-gray-300 dark:text-gray-600/80 font-light"
        >
          {{ i + 1 }}
        </span>
        <span
          :class="[
            'block text-gray-800 dark:text-gray-300 font-medium truncate text-sm',
            i + 1 < 10 ? 'pr-12' : 'pr-24'
          ]"
        >
          {{ item.name }}
        </span>
        <span class="block text-xs text-gray-500 dark:text-gray-400">
          {{
            t('dashboard.stats.bookCount', item.count).replace(
              item.count.toString(),
              n(item.count, 'integer')
            )
          }}
        </span>
      </li>
    </ol>
    <div v-else aria-hidden="true" class="mt-4 divide-y dark:divide-gray-700">
      <div v-for="position of 10" :key="position" class="py-2.5 relative">
        <span
          aria-hidden="true"
          class="select-none absolute right-1 inset-y-0 flex items-center text-6xl leading-none italic font-display tracking-tighter text-gray-300 dark:text-gray-600/80 font-light"
        >
          {{ position }}
        </span>
        <div class="skeleton w-32 h-5" />
        <div class="skeleton w-16 h-3 mt-1" />
      </div>
    </div>
  </section>
</template>
