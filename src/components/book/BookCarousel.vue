<script lang="ts" setup>
import cloneDeep from 'lodash.clonedeep'

import type Book from '@/model/Book'
import { STATUS_READ } from '@/model/Book'
import type { GridMode, SpoilerMode } from '@/stores/settings'

export interface BookCarouselProps {
  blurNsfw?: boolean
  editingIds?: string[]
  items?: Book[]
  loading?: boolean
  mode?: GridMode
  showReadingActions?: boolean
  spoilerMode?: SpoilerMode
  title: string
}

const props = withDefaults(defineProps<BookCarouselProps>(), {
  blurNsfw: false,
  editingIds: () => [],
  items: undefined,
  loading: false,
  mode: 'comfortable',
  showReadingActions: false,
  spoilerMode: () => ({
    cover: false,
    synopsis: false,
  }),
})

const emit = defineEmits<{
  (e: 'markAsRead', book: Book): void
}>()

const {
  blurNsfw,
  mode,
  spoilerMode,
  items,
  loading,
  showReadingActions,
  editingIds,
} = toRefs(props)

const carousel = ref<HTMLUListElement>()
const focused = ref(0)

function handleKeydown(event: KeyboardEvent) {
  const allowedKeys = ['ArrowRight', 'ArrowLeft', 'Home', 'End']
  const { key } = event

  if (key === 'Tab') {
    setTimeout(() => {
      focused.value = 0
    })
    return
  }

  if (!allowedKeys.includes(key) || editingIds.value.length > 0) {
    return
  }

  // https://stackoverflow.com/a/21696585
  const visibleItems = Array.from(carousel.value!.children).filter(
    el => (el as HTMLLIElement).offsetParent !== null,
  )
  const totalItems = visibleItems.length

  if (key === 'Home' && focused.value === 0) {
    return
  }

  if (key === 'End' && focused.value === totalItems - 1) {
    return
  }

  event.preventDefault()

  if (key === 'ArrowRight') {
    focused.value = Math.min(focused.value + 1, totalItems - 1)
  } else if (key === 'ArrowLeft') {
    focused.value = Math.max(focused.value - 1, 0)
  } else if (key === 'Home') {
    focused.value = 0
  } else if (key === 'End') {
    focused.value = totalItems - 1
  }

  const li = carousel.value?.children?.[focused.value]
  let card = li?.children?.[0] as HTMLAnchorElement | undefined

  if (showReadingActions.value) {
    card = card?.children?.[0] as HTMLAnchorElement | undefined
  }

  card?.focus()
}

function handleRead(book: Book, readAt: Date) {
  if (editingIds.value.length > 0) {
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
  <DashboardBlock v-if="(items?.length ?? 0) > 0 || loading">
    <template #title="{ titleClasses }">
      <div class="flex justify-between items-center w-full">
        <h2 :class="titleClasses">
          {{ title }}
        </h2>

        <slot name="actions" />
      </div>
    </template>

    <ul
      v-if="!loading"
      ref="carousel"
      :class="[
        items!.length < 3
          ? 'grid grid-cols-2'
          : '-mx-4 md:mx-0 px-4 md:px-0 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory md:snap-none pb-2 md:pb-0 flex md:grid',
        'md:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 mt-4',
      ]"
    >
      <li
        v-for="(book, bookIdx) in items"
        :key="book.id!"
        :class="[
          items!.length > 2
            ? 'shrink-0 w-2/5 sm:w-3/12 md:w-auto snap-start md:snap-none scroll-ml-5 md:scroll-ml-0'
            : '',
          bookIdx === 5 ? 'md:hidden xl:block' : '',
        ]"
      >
        <BookCard
          :book="book"
          :loading="loading"
          :tabindex="focused === bookIdx ? '0' : '-1'"
          :image-only="showReadingActions"
          :mode="mode"
          :spoiler-mode="spoilerMode"
          :blur-nsfw="blurNsfw"
          @keydown="handleKeydown"
        >
          <template v-if="showReadingActions" #actions>
            <BookCardReadingActions
              :book="book"
              :disabled="editingIds.length > 0"
              :editing="editingIds.includes(book.id!)"
              @click:check="handleReadToday(book)"
              @click:calendar="handleRead(book, $event)"
            />
          </template>
        </BookCard>
      </li>
    </ul>

    <div
      v-else
      class="mt-4 -mx-4 md:mx-0 px-4 md:px-0 overflow-x-auto md:overflow-x-visible flex md:grid md:grid-cols-5 xl:grid-cols-6 gap-5"
      aria-hidden="true"
    >
      <div
        v-for="idx in 6"
        :key="idx"
        :class="idx === 5 ? 'md:hidden xl:block' : ''"
        class="shrink-0 w-2/5 sm:w-3/12 md:w-auto"
      >
        <BookCard
          loading
          :image-only="showReadingActions"
          :mode="mode"
          :spoiler-mode="spoilerMode"
          :blur-nsfw="blurNsfw"
        />
      </div>
    </div>
  </DashboardBlock>
</template>
