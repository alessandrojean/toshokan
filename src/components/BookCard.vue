<template>
  <div v-if="loading" class="motion-safe:animate-pulse">
    <div class="bg-gray-400 dark:bg-gray-600 shadow rounded-md aspect-w-2 aspect-h-3">
      <div class="w-full h-full flex justify-center items-center">
        <BookOpenIcon
          class="w-10 h-10 text-gray-300 dark:text-gray-500"
          aria-hidden="true"
        />
      </div>
      <div v-if="mode === 'compact'" class="absolute top-0 left-0 w-full h-full flex items-start justify-end flex-col pb-2 px-2 lg:pb-3 lg:px-3 space-y-2">
        <div class="h-4 bg-gray-200 dark:bg-gray-500 w-3/4 rounded"></div>
        <div class="h-3 bg-gray-200 dark:bg-gray-500 w-1/2 rounded"></div>
      </div>
    </div>
    <div v-if="mode === 'comfortable'" class="mt-3 space-y-1">
      <div class="h-4 bg-gray-400 dark:bg-gray-600 w-3/4 rounded"></div>
      <div class="h-3 bg-gray-400 dark:bg-gray-600 w-1/2 rounded"></div>
    </div>
  </div>
  <router-link
    v-else
    :to="{ name: 'BookDetails', params: { bookId: book.id } }"
    class="group focus:outline-none"
    ref="loadedCard"
    :title="book.title"
    :aria-current="current ? 'page' : undefined"
  >
    <div class="book-card aspect-w-2 aspect-h-3">
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
          v-if="imageLoading || imageHasError"
          class="w-full h-full flex justify-center items-center"
          aria-hidden="true"
        >
          <BookOpenIcon
            :class="[
              imageLoading ? 'motion-safe:animate-pulse' : '',
              'w-10 h-10 text-gray-400 dark:text-gray-500'
            ]"
            aria-hidden="true"
          />
        </div>
        <img
          v-else
          :class="[
            'book-cover',
            spoilerMode.cover && !isRead ? 'is-spoiler' : ''
          ]"
          :src="thumbnailUrl"
          aria-hidden="true"
        >
      </transition>

      <div
        v-if="isRead || current || isFuture"
        class="badge-wrapper"
      >
        <template v-if="!current && !isFuture">
          <span class="sr-only">{{ t('book.read') }}</span>
          <div class="bg-white dark:bg-primary-50 dark:bg-opacity-95 rounded p-0.5">
            <BookmarkIcon class="w-5 h-5 text-primary-500" />
          </div>
        </template>
        <span v-else-if="!current" class="future-item">
          <span aria-hidden="true">
            <ClockIcon class="w-3.5 h-3.5" />
          </span>
          <span>
            {{ t('book.futureItem') }}
          </span>
        </span>
        <span v-else class="current-volume">
          {{ t('book.currentVolume') }}
        </span>
      </div>

      <div v-if="mode === 'compact'" class="book-gradient text-white absolute top-0 left-0 w-full h-full flex items-start justify-end flex-col pb-2 px-2 lg:pb-3 lg:px-3">
        <span class="font-semibold font-display text-sm truncate max-w-full">{{ book.titleParts[0] }}</span>
        <span class="font-medium text-xs">{{ volume }}</span>
      </div>
    </div>

    <div v-if="mode === 'comfortable'" class="mt-3">
      <p class="text-sm font-display font-semibold truncate text-gray-900 dark:text-gray-200">{{ book.titleParts[0] }}</p>
      <p class="text-xs font-medium truncate text-gray-500 dark:text-gray-400">{{ volume }}</p>
    </div>
  </router-link>
</template>

<script>
import { computed, onMounted, ref, toRefs, watch } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

import useImageLazyLoader from '@/composables/useImageLazyLoader'

import { BookOpenIcon } from '@heroicons/vue/outline'
import { BookmarkIcon, ClockIcon } from '@heroicons/vue/solid'

import { BookFavorite, BookStatus } from '@/model/Book'

export default {
  name: 'BookCard',

  components: {
    BookOpenIcon,
    BookmarkIcon,
    ClockIcon
  },

  props: {
    book: {
      type: Object
    },
    current: Boolean,
    loading: {
      type: Boolean,
      required: true
    }
  },

  setup (props) {
    const { book, loading } = toRefs(props)
    const { t } = useI18n()

    const isFavorite = computed(() => book.value.favorite === BookFavorite.ACTIVE)
    const isRead = computed(() => book.value.status === BookStatus.READ)

    const now = new Date()

    const isFuture = computed(() => {
      return book.value && book.value.boughtAt &&
        book.value.boughtAt.getTime() > now.getTime()
    })

    const thumbnailUrl = computed(() => {
      return book.value
        ? book.value.coverUrl.replace('_SL700_', '_SL300_')
        : ''
    })

    const loadedCard = ref(null)

    const {
      imageHasError,
      imageLoading,
      setupObserver,
      observerCreated
    } = useImageLazyLoader(thumbnailUrl, loadedCard)

    const volume = computed(() => {
      if (!book.value) {
        return ''
      }

      const isSingle = book.value.titleParts[1] === undefined

      return t(
        isSingle ? 'book.single' : 'book.volume',
        isSingle ? undefined : { number: book.value.titleParts[1] }
      )
    })

    onMounted(() => {
      if (!loading.value && book.value) {
        setupObserver()
      }
    })

    watch(loading, newValue => {
      if (!newValue && !observerCreated.value) {
        setupObserver()
      }
    })

    const store = useStore()
    const mode = computed(() => store.state.collection.gridMode)
    const spoilerMode = computed(() => store.state.collection.spoilerMode)

    return {
      isFavorite,
      isRead,
      isFuture,
      loadedCard,
      imageHasError,
      imageLoading,
      thumbnailUrl,
      volume,
      mode,
      spoilerMode,
      t
    }
  }
}
</script>

<style scoped>
.book-card {
  @apply relative shadow
    bg-gray-200 dark:bg-gray-700
    rounded-md overflow-hidden motion-safe:transition-shadow
    group-focus-visible:ring-2 group-focus-visible:ring-offset-2
    group-focus-visible:ring-primary-500 dark:group-focus-visible:ring-offset-gray-900;
}

.book-card:hover {
  @apply shadow-lg;
}

.book-gradient {
  background-image: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, transparent 60%);
}

.book-cover {
  @apply object-cover w-full h-full;
}

.book-cover.is-spoiler {
  @apply filter blur;
}

.current-volume,
.future-item {
  @apply px-1.5 py-px rounded
    text-xxs uppercase font-bold tracking-wide
    bg-primary-100 dark:bg-gray-850
    text-primary-600 dark:text-gray-300;
}

.future-item {
  @apply flex items-center space-x-1.5;
}

.badge-wrapper {
  @apply p-2 absolute inset-0 flex justify-start items-start
    bg-gray-900 dark:bg-gray-800
    bg-opacity-20 dark:bg-opacity-60
}
</style>
