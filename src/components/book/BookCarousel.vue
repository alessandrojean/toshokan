<template>
  <div v-if="sheetLoading || loading">
    <div class="skeleton h-6 w-48 mt-8 mb-3"></div>

    <div class="-mx-5 md:mx-0 px-5 md:px-0 overflow-x-auto md:overflow-x-visible flex md:grid md:grid-cols-5 lg:grid-cols-6 gap-5">
      <div
        v-for="idx in 6"
        :key="idx"
        :class="idx === 5 ? 'md:hidden lg:block' : ''"
        class="shrink-0 w-2/5 sm:w-3/12 md:w-auto"
      >
        <BookCard loading :image-only="collection === 'next-reads'" />
      </div>
    </div>
  </div>

  <section
    v-else-if="collectionItems?.length > 0"
    :aria-labelledby="collection + '-title'"
  >
    <div class="flex justify-between items-center w-full mt-8 mb-2">
      <h2 :id="collection + '-title'" class="font-medium font-display text-lg dark:text-gray-200">
        {{ title }}
      </h2>

      <router-link
        v-if="buttonText && buttonLink"
        class="button is-ghost -mr-3 hidden md:flex group"
        :to="buttonLink"
      >
        {{ buttonText }}
        <span aria-hidden="true">
          <ArrowSmRightIcon class="is-right motion-safe:transition-transform group-hover:translate-x-1" />
        </span>
      </router-link>
    </div>

    <ul
      :class="[
        collectionItems.length < 3
          ? 'grid grid-cols-2'
          : '-mx-5 md:mx-0 px-5 md:px-0 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory md:snap-none pb-2 md:pb-0 flex md:grid',
        'md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4'
      ]"
      ref="carousel"
    >
      <li
        v-for="(book, bookIdx) in collectionItems"
        :key="book.id"
        :class="[
          collectionItems.length > 2 ? 'shrink-0 w-2/5 sm:w-3/12 md:w-auto snap-start md:snap-none scroll-ml-5 md:scroll-ml-0' : '',
          bookIdx === 5 ? 'md:hidden lg:block' : ''
        ]"
      >
        <BookCard
          :book="book"
          :loading="loading"
          :tabindex="focused === bookIdx ? '0' : '-1'"
          :image-only="collection === 'next-reads'"
          @keydown="handleKeydown"
        >
          <template #actions v-if="collection === 'next-reads'">
            <BookCardReadingActions
              :book="book"
              :disabled="editing"
              :editing="editingBookId === book.id"
              @click:check="handleReadToday(book)"
              @click:calendar="handleRead(book, $event)"
            />
          </template>
        </BookCard>
      </li>
    </ul>
  </section>
</template>

<script>
import { computed, ref, toRefs } from 'vue'

import cloneDeep from 'lodash.clonedeep'

import { STATUS_READ } from '@/model/Book'
import { useSheetStore } from '@/stores/sheet'
import useLastAddedQuery from '@/queries/useLastAddedQuery'
import useLatestReadingsQuery from '@/queries/useLatestReadingsQuery'
import useNextReadsQuery from '@/queries/useNextReadsQuery'

import { ArrowSmRightIcon } from '@heroicons/vue/solid'

import BookCard from '@/components/book/BookCard.vue'
import BookCardReadingActions from '@/components/book/BookCardReadingActions.vue'
import useEditBookMutation from '@/mutations/useEditBookMutation'

export default {
  components: {
    ArrowSmRightIcon,
    BookCard,
    BookCardReadingActions
  },

  props: {
    collection: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    buttonText: {
      type: String
    },
    buttonLink: {
      type: Object
    }
  },

  setup (props) {
    const { collection } = toRefs(props)
    const sheetStore = useSheetStore()

    const sheetLoading = computed(() => sheetStore.loading)
    const sheetId = computed(() => sheetStore.sheetId)
    const enabled = computed(() => sheetId.value !== null)

    const collectionMapping = {
      'last-added': useLastAddedQuery,
      'latest-readings': useLatestReadingsQuery,
      'next-reads': useNextReadsQuery
    }

    const {
      isLoading: loading,
      data: collectionItems
    } = collectionMapping[collection.value]({ enabled })

    const carousel = ref(null)
    const focused = ref(0)

    /**
     * @param {KeyboardEvent} event
     */
    function handleKeydown (event) {
      const allowedKeys = ['ArrowRight', 'ArrowLeft', 'Home', 'End']
      const { key } = event

      if (key === 'Tab') {
        setTimeout(() => { focused.value = 0 })
        return
      }

      if (!allowedKeys.includes(key) || editing.value) {
        return
      }

      // https://stackoverflow.com/a/21696585
      const visibleItems = Array.from(carousel.value.children)
        .filter(el => el.offsetParent !== null)
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
      let card = li?.children?.[0]

      if (collection.value === 'next-reads') {
        card = card?.children?.[0]
      }

      card?.focus()
    }

    const { isLoading: editing, mutate: edit } = useEditBookMutation()
    const editingBookId = ref(null)

    function handleRead (book, readAt) {
      if (editing.value) {
        return
      }

      /** @type {import('@/model/Book').default} */
      const newBook = cloneDeep(book)
      newBook.status = STATUS_READ
      newBook.readAt = readAt

      editingBookId.value = newBook.id

      edit(newBook, {
        onSuccess () {
          editingBookId.value = null
        }
      })
    }

    function handleReadToday (book) {
      handleRead(book, new Date())
    }

    return {
      sheetLoading,
      loading,
      collectionItems,
      carousel,
      focused,
      handleKeydown,
      editing,
      editingBookId,
      handleRead,
      handleReadToday
    }
  }
}
</script>
