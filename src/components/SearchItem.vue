<script lang="ts" setup>
import { computed, onMounted, ref, toRefs, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import useImageLazyLoader from '@/composables/useImageLazyLoader'
import Book from '@/model/Book'
import { useSettingsStore } from '@/stores/settings'

import FadeTransition from '@/components/transitions/FadeTransition.vue'

import {
  ChevronRightIcon,
  ClockIcon,
  PhotoIcon
} from '@heroicons/vue/24/outline'

const props = defineProps<{ result: Book }>()

const { result } = toRefs(props)

const thumbnailUrl = computed(() => {
  return result.value
    ? result.value.coverUrl?.replace('_SL700_', '_SL300_') ?? ''
    : ''
})

const searchItem = ref<HTMLAnchorElement>()

const { imageHasError, imageLoading, setupObserver, observerCreated } =
  useImageLazyLoader(thumbnailUrl, searchItem)

onMounted(() => {
  if (result.value) {
    setupObserver()
  }
})

watch(result, (newValue) => {
  if (!newValue && !observerCreated.value) {
    setupObserver()
  }
})

const settingsStore = useSettingsStore()

const spoilerMode = computed(() => settingsStore.spoilerMode)
const blurNsfw = computed(() => settingsStore.blurNsfw)

const blurCover = computed(() => {
  return (
    (spoilerMode.value.cover && !result.value.isRead) ||
    (blurNsfw.value && result.value.isNsfw)
  )
})

const { t } = useI18n({ useScope: 'global' })

const authorsFormatted = computed(() => {
  const separator = t('dashboard.details.header.authorSeparator')
  let authors = (result.value.authors || []).join(separator)

  if (result.value.authors && result.value.authors.length >= 2) {
    const firstAuthors = (result.value.authors || [])
      .slice(0, -1)
      .join(separator)

    authors = t('dashboard.details.header.authorListComplete', {
      authors: firstAuthors,
      lastAuthor: result.value.authors[result.value.authors.length - 1]
    })
  }

  return authors
})
</script>

<template>
  <router-link
    :to="{ name: 'BookDetails', params: { bookId: result.id } }"
    class="result group has-ring-focus focus-visible:ring-inset dark:focus-visible:ring-offset-gray-800"
    ref="searchItem"
  >
    <div class="w-14 sm:w-16 shrink-0">
      <FadeTransition>
        <div
          v-if="imageLoading || imageHasError || thumbnailUrl.length === 0"
          class="aspect-w-2 aspect-h-3"
          aria-hidden="true"
        >
          <div class="empty-cover">
            <PhotoIcon
              :class="[
                imageLoading ? 'motion-safe:animate-pulse' : '',
                'w-7 h-7 text-gray-500 dark:text-gray-400'
              ]"
            />
          </div>
        </div>
        <div v-else :class="['result-cover', blurCover ? 'is-hidden' : '']">
          <img :src="thumbnailUrl" :alt="result.title!" />
        </div>
      </FadeTransition>
    </div>
    <div class="flex-grow space-y-3 min-w-0">
      <div class="w-full">
        <h4 class="result-title">
          <span aria-hidden="true" v-if="result.isFuture">
            <ClockIcon class="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
          </span>
          <span>{{ result.title }}</span>
        </h4>
        <p class="result-authors">
          {{ authorsFormatted }}
        </p>
      </div>
      <div class="flex items-center space-x-3 text-xs">
        <span class="result-group">
          {{ result.group }}
        </span>
        <span class="result-publisher">
          {{ result.publisher }}
        </span>
      </div>
    </div>
    <span aria-hidden="true" class="shrink-0 hidden sm:block">
      <ChevronRightIcon class="chevron" />
    </span>
  </router-link>
</template>

<style lang="postcss" scoped>
.result {
  @apply py-4 px-5 flex items-center space-x-4 transition-none;
}

.result-title {
  @apply flex items-center space-x-1.5
    text-sm font-display font-medium w-full truncate
    dark:text-gray-100;
}

.result:where(:hover, :focus-visible) .result-title {
  @apply underline underline-offset-1 decoration-2
    decoration-primary-600/60 dark:decoration-primary-400/80;
}

.result-authors {
  @apply text-sm font-medium inline-block w-full truncate
    text-gray-600 dark:text-gray-300;
}

.result-group {
  @apply text-xxs font-semibold uppercase tracking-wide
    px-2 py-0.5 rounded
    bg-white dark:bg-transparent
    text-gray-500 dark:text-gray-200
    border border-gray-200 dark:border-gray-600;
}

.result:where(:hover, :focus-visible) .result-group {
  @apply text-gray-700 dark:text-gray-200
    border-gray-300 dark:border-gray-500;
}

.result-publisher {
  @apply block text-gray-500 dark:text-gray-400;
}

.result:where(:hover, :focus-visible) .result-publisher {
  @apply text-gray-700 dark:text-gray-300;
}

.result-cover {
  @apply relative overflow-hidden rounded-md
    motion-safe:transition shadow dark:shadow-none;
}

.result-cover img {
  @apply w-full object-cover rounded-md;
}

.result:where(:hover, :focus-visible) .result-cover {
  @apply shadow-md dark:shadow-none
    dark:ring-2 dark:ring-gray-600/50;
}

.result-cover.is-hidden img {
  @apply md:blur-sm md:scale-105
    motion-safe:transition-all motion-safe:ease-in;
}

.result-cover.is-hidden:hover img {
  @apply md:blur-none md:scale-100 md:motion-safe:duration-[2000ms];
}

.empty-cover {
  @apply flex justify-center items-center w-full h-full
    bg-gray-100 dark:bg-gray-700 rounded-md shadow;
}

.result:where(:hover, :focus-visible) .empty-cover {
  @apply shadow-md;
}

.chevron {
  @apply w-5 h-5 p-1 box-content rounded-full
    motion-safe:transition-colors
    text-gray-500 dark:text-gray-400;
}

.result:where(:hover, :focus-visible) .chevron {
  @apply text-primary-600 dark:text-gray-100
    bg-primary-50 dark:bg-gray-700/80;
}
</style>
