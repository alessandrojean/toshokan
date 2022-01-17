<template>
  <router-link
    :to="{ name: 'BookDetails', params: { bookId: result.id } }"
    class="result group has-ring-focus"
    ref="searchItem"
  >
    <div class="w-12 lg:w-16 shrink-0">
      <transition
        mode="out-in"
        leave-active-class="transition motion-reduce:transition-none duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
        enter-active-class="transition motion-reduce:transition-none duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
      >
        <div
          v-if="imageLoading || imageHasError || thumbnailUrl.length === 0"
          class="aspect-w-2 aspect-h-3"
          aria-hidden="true"
        >
          <div class="empty-cover">
            <PhotographIcon
              :class="[
                imageLoading ? 'motion-safe:animate-pulse' : '',
                'w-7 h-7 text-gray-500 dark:text-gray-400'
              ]"
            />
          </div>
        </div>
        <img
          v-else
          :src="thumbnailUrl"
          :class="[
            'result-cover',
            spoilerMode.cover && !isRead ? 'is-hidden' : ''
          ]"
        >
      </transition>
    </div>
    <div class="flex-grow space-y-3 min-w-0">
      <div class="w-full">
        <h4 class="result-title">
          <span aria-hidden="true" v-if="isFuture">
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
    <span aria-hidden="true" class="shrink-0">
      <ChevronRightIcon class="chevron" />
    </span>
  </router-link>
</template>

<script>
import { computed, onMounted, ref, toRefs, watch } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

import useImageLazyLoader from '@/composables/useImageLazyLoader'

import {
  ChevronRightIcon,
  ClockIcon,
  PhotographIcon
} from '@heroicons/vue/outline'

import { BookStatus } from '@/model/Book'

export default {
  components: {
    ChevronRightIcon,
    ClockIcon,
    PhotographIcon
  },

  props: {
    result: {
      type: Object,
      required: true
    }
  },

  setup (props) {
    const { result } = toRefs(props)

    const thumbnailUrl = computed(() => {
      return result.value
        ? result.value.coverUrl.replace('_SL700_', '_SL300_')
        : ''
    })

    const searchItem = ref(null)

    const {
      imageHasError,
      imageLoading,
      setupObserver,
      observerCreated
    } = useImageLazyLoader(thumbnailUrl, searchItem)

    onMounted(() => {
      if (result.value) {
        setupObserver()
      }
    })

    watch(result, newValue => {
      if (!newValue && !observerCreated.value) {
        setupObserver()
      }
    })

    const store = useStore()

    const spoilerMode = computed(() => store.state.collection.spoilerMode)

    const isRead = computed(() => {
      return result.value && result.value.status === BookStatus.READ
    })

    const now = new Date()

    const isFuture = computed(() => {
      return result.value && result.value.boughtAt &&
        result.value.boughtAt.getTime() > now.getTime()
    })

    const { t } = useI18n()

    const authorsFormatted = computed(() => {
      const separator = t('dashboard.details.header.authorSeparator')
      let authors = (result.value.authors || []).join(separator)

      if (result.value.authors && result.value.authors.length >= 2) {
        const firstAuthors = (result.value.authors || [])
          .slice(0, -1)
          .join(separator)

        authors = t(
          'dashboard.details.header.authorListComplete',
          {
            authors: firstAuthors,
            lastAuthor: result.value.authors[result.value.authors.length - 1]
          }
        )
      }

      return authors
    })

    return {
      searchItem,
      imageHasError,
      imageLoading,
      thumbnailUrl,
      spoilerMode,
      isRead,
      isFuture,
      authorsFormatted
    }
  }
}
</script>

<style lang="postcss" scoped>
.result {
  @apply py-4 flex items-center rounded-md space-x-4;
}

.result-title {
  @apply flex items-center space-x-1.5
    text-sm font-display font-medium w-full truncate
    dark:text-gray-100;
}

.result:hover .result-title {
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
    group-hover:text-gray-700 dark:group-hover:text-gray-200
    border border-gray-200 dark:border-gray-600
    group-hover:border-gray-300 dark:group-hover:border-gray-500;
}

.result-publisher {
  @apply block text-gray-500 dark:text-gray-400
    group-hover:text-gray-700 dark:group-hover:text-gray-300;
}

.result-cover {
  @apply w-full object-cover rounded-md
    shadow group-hover:shadow-md;
}

.result-cover.is-hidden {
  @apply md:blur-sm md:group-hover:blur-none
    motion-safe:transition-all duration-100 ease-in-out;
}

.empty-cover {
  @apply flex justify-center items-center w-full h-full
    bg-gray-100 dark:bg-gray-700 rounded-md
    shadow group-hover:shadow-md;
}

.chevron {
  @apply w-5 h-5 text-gray-500 dark:text-gray-400
    group-hover:text-primary-600 dark:group-hover:text-gray-100;
}
</style>
