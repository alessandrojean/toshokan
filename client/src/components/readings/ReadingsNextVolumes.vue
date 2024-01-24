<script lang="ts" setup>
import cloneDeep from 'lodash.clonedeep'
import type Book from '@/model/Book'
import { STATUS_READ } from '@/model/Book'
import type { GridMode, SpoilerMode } from '@/stores/settings'

export interface ReadingsNextVolumesProps {
  blurNsfw?: boolean
  books?: Book[]
  editing?: boolean
  editingId?: string
  gridMode?: GridMode
  loading?: boolean
  spoilerMode?: SpoilerMode
}

const props = withDefaults(defineProps<ReadingsNextVolumesProps>(), {
  blurNsfw: false,
  books: undefined,
  editing: false,
  editingId: undefined,
  gridMode: 'comfortable',
  loading: false,
  spoilerMode: () => ({
    cover: false,
    synopsis: false,
  }),
})

const emit = defineEmits<{
  (e: 'markAsRead', book: Book): void
}>()

const { blurNsfw, books, editing, editingId, gridMode, loading, spoilerMode }
  = toRefs(props)

function handleRead(book: Book, readAt: Date) {
  if (editing.value) {
    return
  }

  const newBook = cloneDeep(toRaw(book))
  newBook.status = STATUS_READ
  newBook.readAt = readAt

  emit('markAsRead', newBook)
}

function handleReadToday(book: Book) {
  handleRead(book, new Date())
}
</script>

<template>
  <BookGrid
    :items="books"
    :current-page="1"
    :loading="loading"
    :skeleton-items="30"
    :mode="gridMode"
    :blur-nsfw="blurNsfw"
    :spoiler-mode="spoilerMode"
    image-only
  >
    <template #actions="{ book }">
      <BookCardReadingActions
        :book="book"
        :disabled="editing"
        :editing="editingId === book.id!"
        @click:check="handleReadToday(book)"
        @click:calendar="handleRead(book, $event)"
      />
    </template>
  </BookGrid>
</template>
