<template>
  <figure class="aspect-w-1 aspect-h-1 bg-gray-800 dark:bg-gray-700 md:bg-gray-50 dark:bg-transparent md:dark:bg-transparent md:border md:border-gray-200 md:dark:border-gray-700 md:rounded-lg relative">
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
          <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md inline-flex divide-x divide-gray-200 dark:divide-gray-700">
            <span class="py-1 px-1.5 flex items-center justify-center" v-if="country">
              <img :src="countryFlagUrl" class="w-6 h-6 p-px">
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
  </figure>
</template>

<script>
import { computed, onMounted, toRefs, watch } from 'vue'

import { BookOpenIcon } from '@heroicons/vue/outline'
import { BookmarkIcon, StarIcon } from '@heroicons/vue/solid'

import useImageLoader from '@/composables/useImageLoader'

import { BookStatus, BookFavorite } from '@/model/Book'
import { getIsbnCountry } from '@/util/isbn'

export default {
  components: {
    BookOpenIcon,
    BookmarkIcon,
    StarIcon
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

    const countryFlagUrl = computed(() => {
      if (!country.value) {
        return null
      }

      const countryCode = country.value[0].toLowerCase()
      return `https://hatscripts.github.io/circle-flags/flags/${countryCode}.svg`
    })

    return {
      coverUrl,
      showBookCover,
      showBookInfo,
      imageLoading,
      isRead,
      isFavorite,
      country,
      countryFlagUrl
    }
  }
}
</script>
