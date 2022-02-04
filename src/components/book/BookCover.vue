<template>
  <figure class="group aspect-w-2 aspect-h-[2.5] sm:aspect-h-2 md:aspect-w-1 md:aspect-h-1 bg-gray-800 dark:bg-gray-700 md:bg-gray-50 dark:bg-transparent md:dark:bg-transparent md:border md:border-gray-200 md:dark:border-gray-600 md:rounded-lg relative">
    <transition
      leave-active-class="motion-safe:transition duration-1000 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
      enter-active-class="motion-safe:transition duration-1000 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
    >
      <div v-if="showBookCover" class="absolute inset-0 w-full h-full md:rounded-lg overflow-hidden motion-safe:transition-all">
        <img :src="coverUrl" class="w-full h-full object-cover opacity-30 md:dark:opacity-40 blur-lg scale-105">
      </div>
    </transition>

    <div class="px-9 pt-28 sm:pt-24 pb-20 md:px-9 md:py-9 flex items-center justify-center">
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
          class="absolute bottom-0 hidden md:flex justify-center translate-y-1/2"
          aria-hidden="true"
        >
          <BookNavigator :book="book" :collection="collection" />
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
          :class="blurCover ? 'md:filter md:blur-sm md:hover:blur-none motion-safe:transition-all duration-200 ease-in-out' : ''"
          class="max-w-xs md:max-w-full max-h-full shadow-lg rounded"
        >
        <span v-else aria-hidden="true">
          <BookOpenIcon
            :class="(loading || imageLoading) ? 'motion-safe:animate-pulse' : ''"
            class="w-12 h-12 text-gray-500/80 dark:text-gray-400/90"
          />
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
import { ZoomInIcon } from '@heroicons/vue/solid'

import BookCoverDialog from '@/components/dialogs/BookCoverDialog.vue'
import BookNavigator from '@/components/book/BookNavigator.vue'

import useImageLoader from '@/composables/useImageLoader'

import Book from '@/model/Book'
import { getIsbnCountry } from '@/util/isbn'

export default {
  components: {
    BookOpenIcon,
    ZoomInIcon,
    BookCoverDialog,
    BookNavigator
  },

  props: {
    book: Book,
    collection: Array,
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

    const country = computed(() => {
      if (!book.value || !book.value.codeType.includes('ISBN')) {
        return null
      }

      return getIsbnCountry(book.value.code)
    })

    const store = useStore()

    const spoilerMode = computed(() => store.state.settings.spoilerMode)
    const blurNsfw = computed(() => store.state.settings.blurNsfw)

    const blurCover = computed(() => {
      return (spoilerMode.value.cover && !book.value.isRead) ||
        (blurNsfw.value && book.value.isNsfw)
    })

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
      country,
      blurCover,
      dialogOpen,
      openDialog,
      closeDialog,
      t
    }
  }
}
</script>
