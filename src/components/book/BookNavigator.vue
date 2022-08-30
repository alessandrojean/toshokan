<script setup>
import { computed, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'

import Book from '@/model/Book'

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/vue/20/solid'

const props = defineProps({
  book: Book,
  collection: Array
})

const { book, collection } = toRefs(props)

const bookIdx = computed(() => {
  return (collection.value || []).findIndex(
    (colItem) => colItem.id === book.value.id
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
  <nav class="">
    <ul
      class="font-medium text-sm flex divide-x dark:divide-gray-700 dark:text-gray-300"
    >
      <li v-if="previous">
        <router-link
          :class="[
            !next ? 'rounded-full pr-5' : 'rounded-l-full pr-2.5',
            'bg-white dark:bg-gray-800 group shadow-md flex items-center py-1.5 pl-2.5 navigation-link previous has-ring-focus'
          ]"
          :to="{ name: 'BookDetails', params: { bookId: previous.id } }"
        >
          <span aria-hidden="true">
            <ArrowLeftIcon class="w-5 h-5 mr-2" />
          </span>
          <span>{{ t('pagination.previous') }}</span>
        </router-link>
      </li>
      <li v-if="next">
        <router-link
          :class="[
            !previous ? 'rounded-full pl-5' : 'rounded-r-full pl-2.5',
            'bg-white dark:bg-gray-800 group shadow-md flex items-center py-1.5 pr-2.5 navigation-link next has-ring-focus'
          ]"
          :to="{ name: 'BookDetails', params: { bookId: next.id } }"
        >
          <span>{{ t('pagination.next') }}</span>
          <span aria-hidden="true">
            <ArrowRightIcon class="w-5 h-5 ml-2" />
          </span>
        </router-link>
      </li>
    </ul>
  </nav>
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
