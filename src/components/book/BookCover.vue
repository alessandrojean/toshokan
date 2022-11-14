<script lang="ts" setup>
import Book from '@/model/Book'
import type { SpoilerMode } from '@/stores/settings'

import {
  ExclamationCircleIcon,
  EyeIcon,
  MagnifyingGlassPlusIcon,
  PhotoIcon
} from '@heroicons/vue/24/outline'

export interface BookCoverProps {
  blurNsfw?: boolean
  book: Book | null | undefined
  loading?: boolean
  spoilerMode?: SpoilerMode
}

const props = withDefaults(defineProps<BookCoverProps>(), {
  blurNsfw: false,
  book: undefined,
  collection: undefined,
  loading: false,
  spoilerMode: () => ({
    cover: false,
    synopsis: false
  })
})

const { book, loading, spoilerMode, blurNsfw } = toRefs(props)

const coverUrl = computed(() => {
  if (!book.value) {
    return ''
  }

  return book.value.coverUrl || ''
})

const { imageHasError, imageLoading, imageAspectRatio, loadImage } =
  useImageLoader(coverUrl)

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

const blurCover = computed(() => {
  return (
    (spoilerMode.value.cover && !book.value!.isRead) ||
    (blurNsfw.value && book.value!.isNsfw)
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
    class="group aspect-[var(--aspect)] rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800 relative shadow-md"
    :style="{ aspectRatio: imageAspectRatio }"
  >
    <FadeTransition>
      <img
        v-if="showBookCover"
        :src="coverUrl"
        :alt="
          book?.title
            ? t('dashboard.details.cover', { title: book.title })
            : undefined
        "
        :class="['w-full h-full', blurCover ? ' filter blur-sm scale-105' : '']"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <PhotoIcon
          v-if="imageLoading || loading || coverUrl.length === 0"
          :class="[
            'w-10 h-10 text-gray-500 dark:text-gray-600',
            imageLoading || loading ? 'motion-safe:animate-pulse' : ''
          ]"
        />
        <ExclamationCircleIcon
          v-else
          class="w-10 h-10 text-gray-500 dark:text-gray-600"
        />
      </div>
    </FadeTransition>

    <button
      v-if="showBookCover"
      class="z-10 bg-gray-900/60 flex items-center justify-center absolute inset-0 opacity-0 group-hover:opacity-100 motion-safe:transition-opacity"
      type="button"
      :title="t('dashboard.details.zoom.view')"
      @click="openDialog"
    >
      <EyeIcon v-if="blurCover" class="w-8 h-8 text-white" />
      <MagnifyingGlassPlusIcon v-else class="w-8 h-8 text-white" />
    </button>

    <slot />

    <BookCoverDialog
      v-if="showBookCover && showBookInfo"
      :cover-url="coverUrl"
      :open="dialogOpen"
      @close="closeDialog"
    />
  </figure>
</template>
