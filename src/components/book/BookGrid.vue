<template>
  <div>
    <template v-if="sheetLoading || (loading && items.length === 0)">
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4 sm:gap-6 md:gap-5">
        <BookCard
          v-for="tempBook in skeletonItems"
          :key="tempBook"
          :loading="true"
        />
      </div>
      <div class="motion-safe:animate-pulse mt-6 w-full h-28 md:h-14 bg-gray-400 dark:bg-gray-600 rounded"></div>
    </template>
    <template v-else>
      <ul
        class="mb-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4 sm:gap-6 md:gap-5"
        v-if="!loading"
        ref="grid"
      >
        <li
          v-for="(book, bookIdx) in items"
          :key="book.id"
        >
          <BookCard
            :book="book"
            :loading="loading"
            :tabindex="bookIdx === focused ? '0' : '-1'"
            @keydown="handleKeydown"
          />
        </li>
      </ul>

      <div
        class="mb-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4 sm:gap-6 md:gap-5"
        v-else
      >
        <BookCard
          v-for="tempBook in skeletonItems"
          :key="tempBook"
          :loading="true"
        />
      </div>
    </template>
  </div>
</template>

<script>
import { computed, nextTick, ref, toRefs, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { useCollectionStore } from '@/stores/collection'
import { useSheetStore } from '@/stores/sheet'

import BookCard from '@/components/book/BookCard.vue'

export default {
  components: { BookCard },

  props: {
    items: Array,
    skeletonItems: Number
  },

  setup (props) {
    const collectionStore = useCollectionStore()
    const sheetStore = useSheetStore()

    const sheetLoading = computed(() => sheetStore.loading)
    const loading = computed(() => collectionStore.books.loading)

    const { t } = useI18n({ useScope: 'global' })

    const focused = ref(0)
    const grid = ref(null)
    const { items } = toRefs(props)

    const columnSize = {
      '1024px': 6, // lg
      '768px': 5, // md
      '640px': 3 // sm
    }

    function getColumnSize () {
      const match = Object.entries(columnSize)
        .find(([minWidth]) => {
          return window.matchMedia(`(min-width: ${minWidth})`).matches
        })

      return match?.[1] || 2
    }

    /**
     * @param {KeyboardEvent} event
     */
    function handleKeydown (event) {
      const allowedKeys = [
        'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
        'Home', 'End'
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
        focused.value = row < lines
          ? Math.min(totalItems - 1, focused.value + columns)
          : focused.value
      } else if (key === 'ArrowUp') {
        focused.value = row > 1
          ? Math.max(0, focused.value - columns)
          : focused.value
      } else if (key === 'Home') {
        focused.value = 0
      } else if (key === 'End') {
        focused.value = totalItems - 1
      }

      focus()
    }

    watch(
      () => sheetLoading.value || loading.value,
      () => { focused.value = 0 }
    )

    function focus () {
      nextTick(() => {
        const li = grid.value?.children?.[focused.value]
        const card = li?.children?.[0]

        card?.focus()
      })
    }

    return {
      sheetLoading,
      loading,
      focused,
      grid,
      handleKeydown,
      focus,
      t
    }
  }
}
</script>
