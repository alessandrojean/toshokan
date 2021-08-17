<template>
  <div class="space-y-6 md:space-y-8">
    <div>
      <!-- Book breadcrumb -->
      <BookBreadcrumb
        :loading="!showBookInfo"
        :book="book"
        class="md:hidden mb-1"
        hide-home
      />

      <!-- Book title -->
      <h2
        v-if="showBookInfo"
        class="font-semibold font-title text-2xl md:text-3xl dark:text-gray-100"
      >
        {{ book.title }}
      </h2>
      <div v-else class="motion-safe:animate-pulse w-72 h-8 mb-2 bg-gray-400 dark:bg-gray-600 rounded"></div>

      <!-- Book authors -->
      <p
        v-if="showBookInfo"
        class="font-medium text-gray-500 dark:text-gray-400 text-md md:text-lg"
      >
        {{ authorsFormatted }}
      </p>
      <div v-else class="motion-safe:animate-pulse h-6 bg-gray-400 dark:bg-gray-600 rounded w-44"></div>
    </div>

    <!-- Book synopsis -->
    <div
      v-if="showBookInfo"
      v-html="synopsisRendered"
      class="prose-sm md:prose leading-normal max-w-none dark:text-gray-300"
    />
    <div v-else class="flex flex-col space-y-2">
      <div class="motion-safe:animate-pulse w-full h-5 bg-gray-400 dark:bg-gray-600 rounded"></div>
      <div class="motion-safe:animate-pulse w-full h-5 bg-gray-400 dark:bg-gray-600 rounded"></div>
      <div class="motion-safe:animate-pulse w-full h-5 bg-gray-400 dark:bg-gray-600 rounded"></div>
      <div class="motion-safe:animate-pulse w-full h-5 bg-gray-400 dark:bg-gray-600 rounded"></div>
      <div class="motion-safe:animate-pulse w-full h-5 bg-gray-400 dark:bg-gray-600 rounded"></div>
      <div class="motion-safe:animate-pulse w-6/12 h-5 bg-gray-400 dark:bg-gray-600 rounded"></div>
    </div>

    <!-- Book actions -->
    <div class="flex space-x-2">
      <button
        v-if="showBookInfo"
        class="button text-base is-primary justify-center md:justify-start flex-1 md:flex-initial"
        @click="$emit('click:edit', $event)"
        :disabled="disabled"
      >
        <span aria-hidden="true">
          <PencilIcon class="w-5 h-5" />
        </span>
        {{ t('dashboard.details.header.edit') }}
      </button>
      <div v-else class="motion-safe:animate-pulse flex-1 md:flex-initial md:w-28 h-11 bg-gray-400 dark:bg-gray-600 rounded"></div>

      <BookMenu
        v-if="showBookInfo"
        :book="book"
        :disabled="disabled"
        @click:delete="$emit('click:delete', $event)"
        @click:toggleFavorite="$emit('click:toggleFavorite', $event)"
        @click:toggleStatus="$emit('click:toggleStatus', $event)"
        @click:updateCover="$emit('click:updateCover', $event)"
      />
      <div v-else class="motion-safe:animate-pulse w-10 md:w-28 h-11 bg-gray-400 dark:bg-gray-600 rounded"></div>
    </div>

    <!-- Book metadata -->
    <div class="pt-4 border-t border-gray-300 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
      <ul v-if="showBookInfo">
        <li v-if="book.codeType !== 'N/A'">
          {{ `${book.codeType}: ${book.code}` }}
        </li>
        <li>
          {{ `${t('book.properties.createdAt')}: ${createdAt}` }}
        </li>
        <li>
          {{ `${t('book.properties.updatedAt')}: ${updatedAt}` }}
        </li>
      </ul>
      <div v-else class="flex flex-col space-y-1">
        <div class="motion-safe:animate-pulse w-44 h-4 bg-gray-400 dark:bg-gray-600 rounded"></div>
        <div class="motion-safe:animate-pulse w-52 h-4 bg-gray-400 dark:bg-gray-600 rounded"></div>
        <div class="motion-safe:animate-pulse w-64 h-4 bg-gray-400 dark:bg-gray-600 rounded"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

import useMarkdown from '@/composables/useMarkdown'

import { PencilIcon } from '@heroicons/vue/solid'

import BookBreadcrumb from '@/components/BookBreadcrumb.vue'
import BookMenu from '@/components/BookMenu.vue'

export default {
  components: {
    PencilIcon,
    BookBreadcrumb,
    BookMenu
  },

  props: {
    book: Object,
    disabled: Boolean,
    loading: Boolean
  },

  emits: [
    'click:edit',
    'click:delete',
    'click:toggleFavorite',
    'click:toggleStatus',
    'click:updateCover'
  ],

  setup (props) {
    const { book, loading } = toRefs(props)
    const { t, d } = useI18n()
    const store = useStore()

    const showBookInfo = computed(() => {
      return !loading.value && book.value
    })

    const authorsFormatted = computed(() => {
      const separator = t('dashboard.details.header.authorSeparator')
      let authors = (book.value.authors || []).join(separator)

      if (book.value.authors && book.value.authors.length >= 2) {
        const firstAuthors = (book.value.authors || [])
          .slice(0, -1)
          .join(separator)

        authors = t(
          'dashboard.details.header.authorListComplete',
          {
            authors: firstAuthors,
            lastAuthor: book.value.authors[book.value.authors.length - 1]
          }
        )
      }

      return authors
    })

    const { renderMarkdown } = useMarkdown()

    const synopsisRendered = computed(() => {
      if (!showBookInfo.value) {
        return ''
      }

      if (book.value.synopsis.length === 0) {
        return t('book.emptySynopsis')
      }

      return renderMarkdown(book.value.synopsis)
    })

    const timeZone = computed(() => store.state.sheet.timeZone)

    function formatDate (date, format = 'short') {
      if (typeof date === 'string' && date.length > 0) {
        return d(
          new Date(`${date}T00:00:00.000${timeZone.value.offsetStr}`),
          format,
          { timeZone: timeZone.value.name }
        )
      }

      if (date instanceof Date) {
        return d(date, format, { timeZone: timeZone.value.name })
      }

      return t('dashboard.details.info.dateUnknown')
    }

    const readAt = computed(() => {
      return showBookInfo.value && book.value.readAt
        ? formatDate(book.value.readAt)
        : t('dashboard.details.info.dateUnknown')
    })

    const createdAt = computed(() => {
      return showBookInfo.value && book.value.createdAt
        ? formatDate(book.value.createdAt, 'long')
        : ''
    })

    const updatedAt = computed(() => {
      return showBookInfo.value && book.value.updatedAt
        ? formatDate(book.value.updatedAt, 'long')
        : ''
    })

    return {
      showBookInfo,
      authorsFormatted,
      synopsisRendered,
      readAt,
      createdAt,
      updatedAt,
      t
    }
  }
}
</script>
