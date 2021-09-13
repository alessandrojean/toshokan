<template>
  <figure class="group aspect-w-1 aspect-h-1 bg-gray-800 dark:bg-gray-700 md:bg-gray-50 dark:bg-transparent md:dark:bg-transparent md:border md:border-gray-200 md:dark:border-gray-600 md:rounded-lg relative">
    <div class="p-9 flex items-center justify-center">
      <transition
        leave-active-class="transition motion-reduce:transition-none duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
        enter-active-class="transition motion-reduce:transition-none duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
      >
        <div
          v-if="showBookInfo"
          class="absolute bottom-0 hidden md:flex justify-center transform translate-y-1/2"
          aria-hidden="true"
        >
          <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-md inline-flex divide-x divide-gray-200 dark:divide-gray-600">
            <span class="py-1 px-1.5 flex items-center justify-center" v-if="country">
              <img :src="country.flagUrl" class="w-6 h-6 p-px">
            </span>
            <span class="py-1 px-1.5" v-if="isRead">
              <BookmarkIcon class="w-6 h-6 text-primary-600 dark:text-primary-500" />
            </span>
            <span class="py-1 px-1.5" v-if="isFavorite">
              <StarIcon class="w-6 h-6 text-yellow-500 dark:text-yellow-300" />
            </span>
          </div>
        </div>
      </transition>

      <transition
        leave-active-class="transition motion-reduce:transition-none duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
        enter-active-class="transition motion-reduce:transition-none duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
      >
        <div
          v-if="showBookCover && showBookInfo"
          class="absolute right-2 top-2 hidden md:block"
        >
          <button
            class="flex items-center justify-center rounded-md p-1.5 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 motion-safe:transition-opacity text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 dark:focus-visible:ring-primary-500"
            @click="openDialog"
            :title="t('dashboard.details.zoom.view')"
          >
            <span aria-hidden="true">
              <ZoomInIcon class="w-5 h-5" />
            </span>
            <span class="sr-only">
              {{ t('dashboard.details.zoom.view') }}
            </span>
          </button>
        </div>
      </transition>

      <transition
        mode="out-in"
        leave-active-class="transition motion-reduce:transition-none duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
        enter-active-class="transition motion-reduce:transition-none duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
      >
        <img
          v-if="showBookCover"
          :src="coverUrl"
          :class="spoilerMode.cover && !isRead ? 'md:filter md:blur-sm md:hover:blur-none motion-safe:transition-all duration-200 ease-in-out' : ''"
          class="max-w-full max-h-full shadow-lg rounded"
        >
        <span
          v-else
          aria-hidden="true"
          :class="(loading || imageLoading) ? 'motion-safe:animate-pulse' : ''"
        >
          <BookOpenIcon class="w-12 h-12 text-gray-400 dark:text-gray-600" />
        </span>
      </transition>
    </div>

    <BookCoverDialog
      v-if="showBookCover && showBookInfo"
      :cover-url="coverUrl"
      :open="dialogOpen"
      @close="closeDialog"
    />
  </figure>
</template>

<script>
import { computed, onMounted, ref, toRefs, watch } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

import { BookOpenIcon } from '@heroicons/vue/outline'
import { BookmarkIcon, StarIcon, ZoomInIcon } from '@heroicons/vue/solid'

import BookCoverDialog from '@/components/BookCoverDialog.vue'

import useImageLoader from '@/composables/useImageLoader'

import { BookStatus, BookFavorite } from '@/model/Book'
import { getIsbnCountry } from '@/util/isbn'

export default {
  components: {
    BookOpenIcon,
    BookmarkIcon,
    StarIcon,
    ZoomInIcon,
    BookCoverDialog
  },

  props: {
    book: Object,
    loading: Boolean
  },

  setup (props) {
    const { book, loading } = toRefs(props)

    const coverUrl = computed(() => {
      if (!book.value) {
        return ''
      }

      return book.value.coverUrl || ''
    })

    const {
      imageHasError,
      imageLoading,
      loadImage
    } = useImageLoader(coverUrl)

    const showBookCover = computed(() => {
      return !imageHasError.value && !imageLoading.value && showBookInfo.value
    })

    const showBookInfo = computed(() => {
      return !loading.value && book.value !== null
    })

    watch(book, newValue => {
      if (newValue !== null) {
        loadImage()
      }
    })

    onMounted(() => {
      if (book.value !== null) {
        loadImage()
      }
    })

    const isRead = computed(() => {
      return book.value && book.value.status === BookStatus.READ
    })

    const isFavorite = computed(() => {
      return book.value && book.value.favorite === BookFavorite.ACTIVE
    })

    const country = computed(() => {
      if (!book.value || !book.value.codeType.includes('ISBN')) {
        return null
      }

      return getIsbnCountry(book.value.code)
    })

    const store = useStore()

    const spoilerMode = computed(() => store.state.collection.spoilerMode)

    const dialogOpen = ref(false)

    function openDialog () {
      dialogOpen.value = true
    }

    function closeDialog () {
      dialogOpen.value = false
    }

    const { t } = useI18n()

    return {
      coverUrl,
      showBookCover,
      showBookInfo,
      imageLoading,
      isRead,
      isFavorite,
      country,
      spoilerMode,
      dialogOpen,
      openDialog,
      closeDialog,
      t
    }
  }
}
</script>
