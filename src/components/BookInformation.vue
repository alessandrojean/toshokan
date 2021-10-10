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
        class="book-title"
      >
        <span aria-hidden="true" v-if="isFuture">
          <ClockIcon class="w-5 h-5 mr-0.5 align-baseline inline-block text-gray-400 dark:text-gray-500" />
        </span>
        {{ mainTitle }}
      </h2>
      <div v-else class="motion-safe:animate-pulse w-72 h-8 mb-2 bg-gray-400 dark:bg-gray-600 rounded"></div>

      <!-- Book subtitle -->
      <p
        v-if="showBookInfo && subtitle.length > 0"
        class="italic font-semibold dark:font-medium font-display text-md md:text-xl text-gray-600 dark:text-gray-300 -mt-1 mb-2"
      >
        {{ subtitle }}
      </p>

      <!-- Book authors -->
      <p
        v-if="showBookInfo"
        :class="subtitle.length === 0 ? 'md:text-lg' : ''"
        class="author-list"
      >
        <template v-for="(author, idx) of book.authors" :key="idx">
          <a
            href="#"
            class="author has-ring-focus"
            @click="searchByAuthor(author)"
          >
            {{ author }}
          </a>
          <span v-if="book.authors.length > 1 && idx < book.authors.length - 1">
            {{ idx === book.authors.length - 2 ? lastSeparator : separator }}
          </span>
        </template>
      </p>
      <div v-else class="motion-safe:animate-pulse h-6 bg-gray-400 dark:bg-gray-600 rounded w-44"></div>
    </div>

    <!-- Book synopsis -->
    <div
      v-if="showBookInfo"
      v-html="synopsisRendered"
      :class="blurSynopsis ? 'md:filter md:blur-sm md:dark:blur md:select-none md:hover:blur-none md:dark:hover:blur-none md:hover:select-auto' : ''"
      class="prose-sm md:prose dark:prose-dark md:dark:prose-dark leading-normal max-w-none dark:text-gray-300"
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

      <button
        v-if="showBookInfo && !isFuture"
        class="button is-icon-only px-2.5"
        :title="
          t('dashboard.details.header.options.markAs', {
            status: t(isRead ? 'book.unread' : 'book.read').toLowerCase() }
          )
        "
        @click="$emit('click:toggleStatus', $event)"
      >
        <span aria-hidden="true">
          <BookmarkSolidIcon v-if="isRead" />
          <BookmarkOutlineIcon v-else />
        </span>
        <span class="sr-only">
          {{
            t('dashboard.details.header.options.markAs', {
              status: t(isRead ? 'book.unread' : 'book.read').toLowerCase() }
            )
          }}
        </span>
      </button>

      <button
        v-if="showBookInfo"
        class="button is-icon-only px-2.5"
        :title="t(`dashboard.details.header.options.${isFavorite ? 'removeFromFavorites' : 'addToFavorites' }`)"
        @click="$emit('click:toggleFavorite', $event)"
      >
        <span aria-hidden="true">
          <StarSolidIcon v-if="isFavorite" />
          <StarOutlineIcon v-else />
        </span>
        <span class="sr-only">
          {{ t(`dashboard.details.header.options.${isFavorite ? 'removeFromFavorites' : 'addToFavorites' }`) }}
        </span>
      </button>

      <button
        v-if="showBookInfo"
        class="button is-icon-only px-2.5"
        :title="t('dashboard.details.header.options.delete')"
        @click="$emit('click:delete', $event)"
      >
        <span aria-hidden="true">
          <TrashIcon />
        </span>
        <span class="sr-only">
          {{ t('dashboard.details.header.options.delete') }}
        </span>
      </button>
    </div>

    <!-- Book metadata -->
    <div class="space-y-4 pt-4 border-t border-gray-300 dark:border-gray-600 text-xs md:text-sm text-gray-600 dark:text-gray-400">
      <ul v-if="showBookInfo">
        <li v-if="book.codeType !== 'N/A'">
          {{ book.codeType }}: <span>{{ book.code }}</span>
        </li>
        <li>
          {{ t('book.properties.createdAt') }}:
          <time :datetime="book.createdAt.toISOString()">
            {{ createdAt }}
          </time>
        </li>
        <li>
          {{ t('book.properties.updatedAt') }}:
          <time :datetime="book.updatedAt.toISOString()">
            {{ updatedAt }}
          </time>
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
          v-if="showBookInfo && externalLinks.length > 0"
          class="flex flex-wrap"
        >
          <li
            v-for="link in externalLinks"
            :key="link.url"
          >
            <a
              class="book-external-link group has-ring-focus"
              target="_blank"
              :href="link.url"
            >
              <span aria-hidden="true">
                <component
                  v-if="link.icon"
                  :is="link.icon"
                  class="w-4 h-4"
                />
                <GlobeAltIcon
                  v-else
                  class="w-4 h-4"
                />
              </span>
              <span>{{ link.title }}</span>
            </a>
          </li>
        </ul>
      </transition>
    </div>
  </div>
</template>

<script>
import { computed, inject, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

import useMarkdown from '@/composables/useMarkdown'

import {
  BookmarkIcon as BookmarkSolidIcon,
  GlobeAltIcon,
  PencilIcon,
  StarIcon as StarSolidIcon
} from '@heroicons/vue/solid'
import {
  BookmarkIcon as BookmarkOutlineIcon,
  ClockIcon,
  StarIcon as StarOutlineIcon,
  TrashIcon
} from '@heroicons/vue/outline'

import AmazonIcon from '@/components/icons/AmazonIcon.vue'
import PaniniIcon from '@/components/icons/PaniniIcon.vue'

import BookBreadcrumb from '@/components/BookBreadcrumb.vue'

import { convertIsbn13ToIsbn10, getIsbnCountry } from '@/util/isbn'

import { BookFavorite, BookStatus } from '@/model/Book'

export default {
  components: {
    AmazonIcon,
    BookmarkOutlineIcon,
    BookmarkSolidIcon,
    ClockIcon,
    GlobeAltIcon,
    PaniniIcon,
    PencilIcon,
    StarOutlineIcon,
    StarSolidIcon,
    TrashIcon,
    BookBreadcrumb
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

    const { renderMarkdown } = useMarkdown()

    const synopsisRendered = computed(() => {
      if (!showBookInfo.value) {
        return ''
      }

      if (book.value.synopsis.length === 0) {
        return `<em>${t('book.emptySynopsis')}</em>`
      }

      return renderMarkdown(book.value.synopsis)
    })

    const timeZone = computed(() => store.state.sheet.timeZone)

    function formatDate (date, format = 'short') {
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

    const isFavorite = computed(() => {
      return book.value?.favorite === BookFavorite.ACTIVE
    })

    const now = new Date()

    const isFuture = computed(() => {
      return book.value && book.value.boughtAt &&
        book.value.boughtAt.getTime() > now.getTime()
    })

    const blurSynopsis = computed(() => {
      return showBookInfo.value && spoilerMode.value.synopsis &&
        !isRead.value && book.value.synopsis.length > 0
    })

    const externalLinks = computed(() => {
      if (!book.value?.codeType?.includes('ISBN')) {
        return []
      }

      const bookCode = book.value ? book.value.code.replaceAll('-', '') : ''

      const links = [{
        title: 'Open Library',
        url: 'https://openlibrary.org/isbn/' + bookCode
      }]

      const amazonLinks = {
        BR: { title: 'Amazon.com.br', url: 'https://amazon.com.br' },
        US: { title: 'Amazon', url: 'https://amazon.com' },
        JP: { title: 'Amazon.co.jp', url: 'https://amazon.co.jp' }
      }

      if (amazonLinks[country.value?.countryCode]) {
        const amazonData = amazonLinks[country.value.countryCode]

        links.push({
          title: amazonData.title,
          url: `${amazonData.url}/dp/${isbn10.value}`,
          icon: AmazonIcon
        })
      }

      if (country.value?.countryCode === 'BR' && book.value?.publisher?.includes('Panini')) {
        links.push({
          title: 'Loja Panini',
          url: `https://loja.panini.com.br/panini/solucoes/busca.aspx?t=${bookCode}`,
          icon: PaniniIcon
        })
      }

      return links.sort((a, b) => a.title.localeCompare(b.title, locale.value))
    })

    const mainTitle = computed(() => {
      if (!book.value) {
        return ''
      }

      const { title, titleParts } = book.value

      if (titleParts[2]) {
        return title.substring(0, title.indexOf(titleParts[2]) - 2).trim()
      }

      return title
    })

    const subtitle = computed(() => book.value?.titleParts[2] || '')

    const separator = computed(() => {
      return t('dashboard.details.header.authorSeparator')
    })

    const lastSeparator = computed(() => {
      return t('dashboard.details.header.authorLastSeparator')
    })

    const showSearchDialog = inject('showSearchDialog')

    function searchByAuthor (author) {
      const query = `${t('dashboard.search.keywords.author')}:"${author}"`
      showSearchDialog(query)
    }

    return {
      showBookInfo,
      synopsisRendered,
      readAt,
      createdAt,
      updatedAt,
      t,
      locale,
      isbn10,
      country,
      isRead,
      isFavorite,
      isFuture,
      spoilerMode,
      blurSynopsis,
      externalLinks,
      mainTitle,
      subtitle,
      separator,
      lastSeparator,
      searchByAuthor
    }
  }
}
</script>

<style lang="postcss" scoped>
.book-title {
  @apply font-bold dark:font-semibold font-display
    text-2xl md:text-3xl dark:text-gray-100;
}

.author-list {
  @apply font-medium text-gray-500 dark:text-gray-400 text-base;
}

.author {
  @apply rounded;
}

.author:hover,
.author:focus-visible {
  @apply text-gray-700 dark:text-gray-200;
}

.author:focus-visible {
  @apply dark:ring-offset-gray-900;
}

.book-external-link {
  @apply flex items-center px-2 py-1
    mr-2 mt-2 space-x-1.5 rounded
    bg-gray-100 dark:bg-gray-700 dark:text-gray-300
    font-medium text-sm;
}

.book-external-link:hover,
.book-external-link:focus-visible {
  @apply bg-gray-200 dark:bg-gray-600
    text-gray-800 dark:text-gray-100;
}

.book-external-link:focus-visible {
  @apply dark:ring-offset-gray-900;
}

.book-external-link svg {
  @apply text-gray-500 dark:text-gray-400;
}

.book-external-link:hover svg,
.book-external-link:focus-visible svg {
  @apply text-gray-600 dark:text-gray-300;
}
</style>
