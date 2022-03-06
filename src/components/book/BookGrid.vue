<script setup>
import { nextTick, ref, toRefs, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useBreakpoints } from '@vueuse/core'

import useTailwindTheme from '@/composables/useTailwindTheme'

import BookCard from '@/components/book/BookCard.vue'

const props = defineProps({
  currentPage: Number,
  current: String,
  items: Array,
  loading: Boolean,
  skeletonItems: Number,
  sortDirection: String,
  sortProperty: String
})

const { t } = useI18n({ useScope: 'global' })
const { breakpoints: themeBreakpoints } = useTailwindTheme()

const breakpoints = useBreakpoints(themeBreakpoints)

const focused = ref(0)
const grid = ref(null)
const { items, loading, currentPage, sortDirection, sortProperty } =
  toRefs(props)

function getColumnSize() {
  if (breakpoints.isGreater('lg')) {
    return 6
  }

  if (breakpoints.isGreater('md')) {
    return 5
  }

  if (breakpoints.isGreater('sm')) {
    return 3
  }

  return 2
}

/**
 * @param {KeyboardEvent} event
 */
function handleKeydown(event) {
  const allowedKeys = [
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown',
    'Home',
    'End'
  ]
  const { key } = event

  if (!allowedKeys.includes(key)) {
    return
  }

  const totalItems = items.value.length
  const columns = getColumnSize()
  const lines = Math.ceil(totalItems / columns)
  const row = Math.floor(focused.value / columns) + 1

  if (key === 'Home' && focused.value === 0) {
    return
  }

  if (key === 'End' && focused.value === totalItems - 1) {
    return
  }

  if (key === 'ArrowUp' && row === 1) {
    return
  }

  if (key === 'ArrowDown' && row === lines) {
    return
  }

  event.preventDefault()

  if (key === 'ArrowRight') {
    focused.value = Math.min(totalItems - 1, focused.value + 1)
  } else if (key === 'ArrowLeft') {
    focused.value = Math.max(0, focused.value - 1)
  } else if (key === 'ArrowDown') {
    focused.value =
      row < lines
        ? Math.min(totalItems - 1, focused.value + columns)
        : focused.value
  } else if (key === 'ArrowUp') {
    focused.value =
      row > 1 ? Math.max(0, focused.value - columns) : focused.value
  } else if (key === 'Home') {
    focused.value = 0
  } else if (key === 'End') {
    focused.value = totalItems - 1
  }

  focus()
}

watch([loading, currentPage, sortDirection, sortProperty], () => {
  focused.value = 0
})

function focus() {
  nextTick(() => {
    const li = grid.value?.children?.[focused.value]
    const card = li?.children?.[0]

    card?.focus()
  })
}

defineExpose({ focus })
</script>

<template>
  <div>
    <div
      v-if="loading"
      class="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2.5 sm:gap-4"
    >
      <BookCard
        v-for="tempBook in skeletonItems"
        :key="tempBook"
        :loading="true"
      />
    </div>
    <ul
      v-else
      class="mb-6 grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2.5 sm:gap-4"
      ref="grid"
    >
      <li v-for="(book, bookIdx) in items" :key="book.id">
        <BookCard
          class="scroll-mt-20"
          :book="book"
          :loading="loading"
          :current="book.id === current"
          :tabindex="bookIdx === focused ? '0' : '-1'"
          @keydown="handleKeydown"
        />
      </li>
    </ul>
  </div>
</template>
