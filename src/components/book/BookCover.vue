<script setup>
import { computed, onMounted, ref, toRefs, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import useImageLoader from '@/composables/useImageLoader'
import Book from '@/model/Book'
import { useSettingsStore } from '@/stores/settings'

import { BookOpenIcon } from '@heroicons/vue/24/outline'
import { MagnifyingGlassPlusIcon } from '@heroicons/vue/20/solid'

import BookCoverDialog from '@/components/dialogs/BookCoverDialog.vue'
import BookNavigator from '@/components/book/BookNavigator.vue'
import FadeTransition from '@/components/transitions/FadeTransition.vue'

const props = defineProps({
  book: Book,
  collection: Array,
  loading: Boolean
})

const { book, loading } = toRefs(props)

const coverUrl = computed(() => {
  if (!book.value) {
    return ''
  }

  return book.value.coverUrl || ''
})

const { imageHasError, imageLoading, loadImage } = useImageLoader(coverUrl)

const showBookCover = computed(() => {
  return !imageHasError.value && !imageLoading.value && showBookInfo.value
})

const showBookInfo = computed(() => {
  return !loading.value && book.value !== null
})

watch(book, (newValue) => {
  if (newValue !== null) {
    loadImage()
  }
})

onMounted(() => {
  if (book.value !== null) {
    loadImage()
  }
})

const country = computed(() => book.value?.isbnData)

const settingsStore = useSettingsStore()

const spoilerMode = computed(() => settingsStore.spoilerMode)
const blurNsfw = computed(() => settingsStore.blurNsfw)

const blurCover = computed(() => {
  return (
    (spoilerMode.value.cover && !book.value.isRead) ||
    (blurNsfw.value && book.value.isNsfw)
  )
})

const dialogOpen = ref(false)

function openDialog() {
  dialogOpen.value = true
}

function closeDialog() {
  dialogOpen.value = false
}

const { t } = useI18n({ useScope: 'global' })
</script>

<template>
  <figure
    class="group aspect-w-2 aspect-h-[2.5] sm:aspect-h-2 md:aspect-w-1 md:aspect-h-1 bg-gray-800 dark:bg-gray-700 md:bg-gray-50 dark:bg-transparent md:dark:bg-transparent md:border md:border-gray-200 md:dark:border-gray-600 md:rounded-2xl relative"
  >
    <FadeTransition>
      <div
        v-if="showBookCover"
        class="absolute inset-0 w-full h-full md:rounded-2xl overflow-hidden motion-safe:transition-all"
      >
        <img
          :src="coverUrl"
          alt=""
          class="w-full h-full object-cover opacity-20 md:dark:opacity-40 blur-lg scale-105"
        />
      </div>
    </FadeTransition>

    <div
      class="px-9 pt-28 sm:pt-24 pb-20 md:px-9 md:py-9 flex items-center justify-center"
    >
      <FadeTransition>
        <div
          v-if="showBookInfo && collection"
          class="absolute bottom-0 hidden md:flex justify-center translate-y-1/2"
          aria-hidden="true"
        >
          <BookNavigator :book="book" :collection="collection" />
        </div>
      </FadeTransition>

      <FadeTransition>
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
              <MagnifyingGlassPlusIcon class="w-5 h-5" />
            </span>
            <span class="sr-only">
              {{ t('dashboard.details.zoom.view') }}
            </span>
          </button>
        </div>
      </FadeTransition>

      <FadeTransition>
        <img
          v-if="showBookCover"
          :src="coverUrl"
          :class="
            blurCover
              ? 'md:filter md:blur-sm md:hover:blur-none motion-safe:transition-all duration-200 ease-in-out'
              : ''
          "
          :alt="book.title"
          class="max-w-xs md:max-w-full max-h-full shadow-lg rounded-md"
        />
        <span v-else aria-hidden="true">
          <BookOpenIcon
            :class="loading || imageLoading ? 'motion-safe:animate-pulse' : ''"
            class="w-12 h-12 text-gray-500/80 dark:text-gray-400/90"
          />
        </span>
      </FadeTransition>
    </div>

    <BookCoverDialog
      v-if="showBookCover && showBookInfo"
      :cover-url="coverUrl"
      :open="dialogOpen"
      @close="closeDialog"
    />
  </figure>
</template>
