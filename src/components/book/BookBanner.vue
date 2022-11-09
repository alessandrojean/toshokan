<script lang="ts" setup>
import { computed, onMounted, toRefs, watch } from 'vue'

import useImageLoader from '@/composables/useImageLoader'
import Book from '@/model/Book'

import FadeTransition from '@/components/transitions/FadeTransition.vue'

export interface BookCoverProps {
  book: Book | null | undefined
  loading?: boolean
}

const props = withDefaults(defineProps<BookCoverProps>(), {
  book: undefined,
  loading: false
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
</script>

<template>
  <div
    aria-hidden="true"
    class="h-72 w-full overflow-hidden relative bg-gray-100 dark:bg-gray-900"
  >
    <FadeTransition>
      <img
        v-if="showBookCover"
        :src="coverUrl"
        :alt="book?.title ?? undefined"
        class="w-full h-full scale-105 object-cover filter blur"
      />
    </FadeTransition>

    <div
      class="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/60 to-gray-900/20"
    />
  </div>
</template>
