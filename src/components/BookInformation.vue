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
        class="font-semibold font-display text-2xl md:text-3xl dark:text-gray-100"
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
      :class="blurSynopsis ? 'md:filter md:blur-sm md:dark:blur md:select-none md:hover:blur-none md:dark:hover:blur-none md:hover:select-auto motion-safe:transition-all duration-100 ease-in-out' : ''"
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
    <div class="space-y-4 pt-4 border-t border-gray-300 dark:border-gray-600 text-xs md:text-sm text-gray-600 dark:text-gray-400">
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

      <transition
        mode="out-in"
        leave-active-class="transition motion-reduce:transition-none duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
        enter-active-class="transition motion-reduce:transition-none duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
      >
        <ul
          v-if="showBookInfo && book.codeType.includes('ISBN')"
          class="flex"
        >
          <li v-if="country[0] === 'BR'">
            <a
              class="button is-small mr-2 mt-2"
              target="_blank"
              :href="'https://amazon.com.br/dp/' + isbn10"
            >
              <span aria-hidden="true">
                <LinkIcon />
              </span>
              <span>Amazon.com.br</span>
            </a>
          </li>

          <li v-if="country[0] === 'US'">
            <a
              class="button is-small mr-2 mt-2"
              target="_blank"
              :href="'https://amazon.com/dp/' + isbn10"
            >
              <span aria-hidden="true">
                <LinkIcon />
              </span>
              <span>Amazon</span>
            </a>
          </li>

          <li v-if="country[0] === 'JP'">
            <a
              class="button is-small mr-2 mt-2"
              target="_blank"
              :href="'https://amazon.co.jp/dp/' + isbn10"
            >
              <span aria-hidden="true">
                <LinkIcon />
              </span>
              <span>Amazon.co.jp</span>
            </a>
          </li>

          <li>
            <a
              class="button is-small mr-2 mt-2"
              target="_blank"
              :href="'https://openlibrary.org/isbn/' + book.code.replaceAll('-', '')"
            >
              <span aria-hidden="true">
                <LinkIcon />
              </span>
              <span>Open Library</span>
            </a>
          </li>
        </ul>
      </transition>
    </div>
  </div>
</template>

<script>
import { computed, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

import useMarkdown from '@/composables/useMarkdown'

import { LinkIcon, PencilIcon } from '@heroicons/vue/solid'

import BookBreadcrumb from '@/components/BookBreadcrumb.vue'
import BookMenu from '@/components/BookMenu.vue'

import { convertIsbn13ToIsbn10, getIsbnCountry } from '@/util/isbn'

import { BookStatus } from '@/model/Book'

export default {
  components: {
    LinkIcon,
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
    const { t, d, locale } = useI18n()
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

    const country = computed(() => {
      if (!showBookInfo.value || !book.value.codeType.includes('ISBN')) {
        return []
      }

      return getIsbnCountry(book.value.code)
    })

    const isbn10 = computed(() => {
      if (!showBookInfo.value || !book.value.codeType.includes('ISBN')) {
        return null
      }

      if (book.value.codeType === 'ISBN-10') {
        return book.value.code
      }

      return convertIsbn13ToIsbn10(book.value.code)
    })

    const spoilerMode = computed(() => store.state.collection.spoilerMode)

    const isRead = computed(() => {
      return book.value && book.value.status === BookStatus.READ
    })

    const blurSynopsis = computed(() => {
      return showBookInfo.value && spoilerMode.value.synopsis &&
        !isRead.value && book.value.synopsis.length > 0
    })

    return {
      showBookInfo,
      authorsFormatted,
      synopsisRendered,
      readAt,
      createdAt,
      updatedAt,
      t,
      locale,
      isbn10,
      country,
      isRead,
      spoilerMode,
      blurSynopsis
    }
  }
}
</script>
