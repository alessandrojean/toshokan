<script lang="ts" setup>
import { computed, toRefs } from 'vue'

import Book from '@/model/Book'
import { useI18n } from '@/i18n'

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/vue/24/outline'

export interface BookNavigatorProps {
  book?: Book | null
  collection?: Book[]
  loading?: boolean
}

const props = withDefaults(defineProps<BookNavigatorProps>(), {
  book: undefined,
  collection: undefined,
  loading: false
})

const { book, collection, loading } = toRefs(props)

const bookIdx = computed(() => {
  return (collection.value ?? []).findIndex(
    (colItem) => colItem.id === book.value!.id
  )
})

const previous = computed(() => {
  if (bookIdx.value === -1) {
    return null
  }

  const previousIdx = bookIdx.value - 1

  return previousIdx >= 0 ? collection.value[previousIdx] : null
})

const next = computed(() => {
  if (bookIdx.value === -1) {
    return null
  }

  const nextIdx = bookIdx.value + 1

  return nextIdx < collection.value.length ? collection.value[nextIdx] : null
})

const { t } = useI18n({ useScope: 'global' })
</script>

<template>
  <nav v-if="!loading && (previous || next)">
    <ul class="flex flex-col sm:flex-row gap-2">
      <li v-if="previous" class="flex-1 shrink-0 min-w-0">
        <RouterLink
          class="flex gap-2 items-center p-4 border dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-800/50 rounded-md group hover:shadow-md hover:-translate-y-0.5 motion-safe:transition will-change-transform"
          :to="{
            name: 'dashboard-library-book-id',
            params: { id: previous.id }
          }"
        >
          <div aria-hidden="true" class="shrink-0">
            <ArrowLeftIcon
              class="w-6 h-6 mr-2 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-gray-200 motion-safe:transition-colors"
            />
          </div>
          <div class="flex-1 shrink-0 min-w-0">
            <span
              class="block text-xs text-right text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300"
            >
              {{ t('pagination.previous') }}
            </span>
            <span
              class="block font-medium text-right truncate dark:text-gray-200 dark:group-hover:text-gray-50"
            >
              {{ t('book.volume', { number: previous!.titleParts.number }) }}
            </span>
          </div>
        </RouterLink>
      </li>
      <li v-if="next" class="flex-1 shrink-0 min-w-0">
        <RouterLink
          class="flex gap-2 items-center p-4 border dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-800/50 rounded-md group hover:shadow-md hover:-translate-y-0.5 motion-safe:transition will-change-transform"
          :to="{ name: 'dashboard-library-book-id', params: { id: next.id } }"
        >
          <div class="flex-1 shrink-0 min-w-0">
            <span
              class="block text-xs text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300"
            >
              {{ t('pagination.next') }}
            </span>
            <span
              class="block font-medium truncate dark:text-gray-200 dark:group-hover:text-gray-50 max-w-full"
            >
              {{ t('book.volume', { number: next!.titleParts.number }) }}
            </span>
          </div>
          <div aria-hidden="true" class="shrink-0">
            <ArrowRightIcon
              class="w-6 h-6 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-gray-200 motion-safe:transition-colors"
            />
          </div>
        </RouterLink>
      </li>
    </ul>
  </nav>
  <div v-else-if="loading" aria-hidden="true">
    <div class="flex flex-col sm:flex-row gap-2">
      <div
        class="grow shrink-0 flex items-center p-4 border dark:border-gray-700 rounded-md"
      >
        <div aria-hidden="true" class="shrink-0">
          <ArrowLeftIcon class="w-6 h-6 mr-2 text-gray-400" />
        </div>
        <div class="grow shrink-0">
          <div class="ml-auto skeleton w-16 h-4" />
          <div class="ml-auto skeleton w-28 h-5 mt-1" />
        </div>
      </div>
      <div
        class="grow shrink-0 flex items-center p-4 border dark:border-gray-700 rounded-md"
      >
        <div class="grow shrink-0">
          <div class="skeleton w-16 h-4" />
          <div class="skeleton w-28 h-5 mt-1" />
        </div>
        <div aria-hidden="true" class="shrink-0">
          <ArrowRightIcon class="w-6 h-6 text-gray-400" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.navigation-link:where(:hover, :focus-visible) {
  @apply underline underline-offset-1 decoration-2 dark:text-gray-100
    decoration-primary-600 dark:decoration-primary-400;
}

.navigation-link.previous:focus-visible {
  @apply relative z-10;
}

.navigation-link svg {
  @apply text-gray-500/80 dark:text-gray-400/80
    motion-safe:transition-transform;
}

.navigation-link:where(:hover, :focus-visible) svg {
  @apply text-primary-600 dark:text-primary-300;
}

.navigation-link.previous:where(:hover, :focus-visible) svg {
  @apply -translate-x-0.5;
}

.navigation-link.next:where(:hover, :focus-visible) svg {
  @apply translate-x-0.5;
}
</style>
