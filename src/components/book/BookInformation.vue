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
        <span aria-hidden="true" v-if="book.isFuture">
          <ClockIcon class="w-5 h-5 mr-0.5 align-baseline inline-block text-gray-400 dark:text-gray-500" />
        </span>
        {{ book.titleParts.main }}
      </h2>
      <div v-else class="motion-safe:animate-pulse w-72 h-8 mb-2 bg-gray-400 dark:bg-gray-600 rounded"></div>

      <!-- Book subtitle -->
      <p
        v-if="showBookInfo && book.titleParts.subtitle"
        class="italic font-medium font-display text-md md:text-xl text-gray-700 dark:text-gray-300 -mt-1 mb-2"
      >
        {{ book.titleParts.subtitle }}
      </p>

      <!-- Book authors -->
      <p v-if="showBookInfo" class="author-list">
        <template v-for="(author, idx) of book.authors" :key="idx">
          <a
            href="#"
            class="author has-ring-focus"
            @click="searchByAuthor(author, $event)"
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
      :class="blurSynopsis ? 'md:blur-sm md:dark:blur md:select-none md:hover:blur-none md:dark:hover:blur-none md:hover:select-auto' : ''"
      class="prose prose-sm md:prose-base dark:prose-invert leading-normal max-w-none"
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
    <div class="flex space-x-2" v-if="canEdit">
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
        v-if="showBookInfo && !book.isFuture"
        class="button is-icon-only px-2.5"
        :title="
          t('dashboard.details.header.options.markAs', {
            status: t(book.isRead ? 'book.unread' : 'book.read').toLowerCase() }
          )
        "
        @click="$emit('click:toggleStatus', $event)"
      >
        <span aria-hidden="true">
          <BookmarkSolidIcon v-if="book.isRead" />
          <BookmarkOutlineIcon v-else />
        </span>
        <span class="sr-only">
          {{
            t('dashboard.details.header.options.markAs', {
              status: t(book.isRead ? 'book.unread' : 'book.read').toLowerCase() }
            )
          }}
        </span>
      </button>

      <button
        v-if="showBookInfo"
        class="button is-icon-only px-2.5"
        :title="t(`dashboard.details.header.options.${book.favorite ? 'removeFromFavorites' : 'addToFavorites' }`)"
        @click="$emit('click:toggleFavorite', $event)"
      >
        <span aria-hidden="true">
          <StarSolidIcon v-if="book.favorite" />
          <StarOutlineIcon v-else />
        </span>
        <span class="sr-only">
          {{ t(`dashboard.details.header.options.${book.favorite ? 'removeFromFavorites' : 'addToFavorites' }`) }}
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
    <div class="space-y-4 pt-4 border-t border-gray-300 dark:border-gray-600 text-xs md:text-sm text-gray-600 dark:text-gray-300">
      <dl v-if="showBookInfo" class="space-y-1">
        <div v-if="book.codeType !== 'N/A'" class="flex">
          <dt class="shrink sm:shrink-0 sm:w-48 text-gray-500 dark:text-gray-400">{{ book.codeType }}</dt>
          <dd class="grow text-right sm:text-left">{{ book.code }}</dd>
        </div>
        <div class="flex">
          <dt class="shrink sm:shrink-0 sm:w-48 text-gray-500 dark:text-gray-400">{{ t('book.properties.createdAt') }}</dt>
          <dd class="tabular-nums grow text-right sm:text-left">
            <time :datetime="book.createdAt.toISOString()">
              {{ createdAt }}
            </time>
          </dd>
        </div>
        <div class="flex">
          <dt class="shrink sm:shrink-0 sm:w-48 text-gray-500 dark:text-gray-400">{{ t('book.properties.updatedAt') }}</dt>
          <dd class="tabular-nums grow text-right sm:text-left">
            <time :datetime="book.updatedAt.toISOString()">
              {{ updatedAt }}
            </time>
          </dd>
        </div>
      </dl>
      <div v-else class="flex flex-col space-y-1">
        <div class="motion-safe:animate-pulse w-44 h-4 bg-gray-400 dark:bg-gray-600 rounded"></div>
        <div class="motion-safe:animate-pulse w-52 h-4 bg-gray-400 dark:bg-gray-600 rounded"></div>
        <div class="motion-safe:animate-pulse w-64 h-4 bg-gray-400 dark:bg-gray-600 rounded"></div>
      </div>

      <div v-if="showBookInfo && shared" class="owner-badge">
        <Avatar :picture-url="ownerPictureUrl" small />
        <div class="owner-info">
          <span class="owner-title">
            {{ t('dashboard.sheetChooser.libraryOf') }}
          </span>
          <p class="owner-name">
            {{ ownerDisplayName }}
          </p>
        </div>
        <div
          class="user-group"
          :title="t('dashboard.sheetChooser.sharedWithYou')"
        >
          <span aria-hidden="true">
            <UserGroupIcon class="w-5 h-5" />
          </span>
          <p class="sr-only">
            {{ t('dashboard.sheetChooser.sharedWithYou') }}
          </p>
        </div>
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
              <span aria-hidden="true" class="icon">
                <component
                  v-if="link.icon"
                  :is="link.icon"
                />
                <GlobeAltIcon v-else />
              </span>
              <span>{{ link.title }}</span>
              <span aria-hidden="true">
                <ExternalLinkIcon class="w-3.5 h-3.5 ext-icon" />
              </span>
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
  ExternalLinkIcon,
  GlobeAltIcon,
  PencilIcon,
  StarIcon as StarSolidIcon
} from '@heroicons/vue/solid'
import {
  BookmarkIcon as BookmarkOutlineIcon,
  ClockIcon,
  StarIcon as StarOutlineIcon,
  TrashIcon,
  UserGroupIcon
} from '@heroicons/vue/outline'

import Avatar from '@/components/Avatar.vue'
import BookBreadcrumb from '@/components/book/BookBreadcrumb.vue'

import { convertIsbn13ToIsbn10, getIsbnCountry } from '@/util/isbn'
import getBookLinks from '@/services/links'

import Book from '@/model/Book'

export default {
  components: {
    Avatar,
    BookBreadcrumb,
    BookmarkOutlineIcon,
    BookmarkSolidIcon,
    ClockIcon,
    ExternalLinkIcon,
    GlobeAltIcon,
    PencilIcon,
    StarOutlineIcon,
    StarSolidIcon,
    TrashIcon,
    UserGroupIcon
  },

  props: {
    book: Book,
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

    const spoilerMode = computed(() => store.state.settings.spoilerMode)

    const blurSynopsis = computed(() => {
      return showBookInfo.value && spoilerMode.value.synopsis &&
        !book.value.isRead && book.value.synopsis.length > 0
    })

    const externalLinks = computed(() => {
      return getBookLinks(book.value, locale.value)
    })

    const separator = computed(() => {
      return t('dashboard.details.header.authorSeparator')
    })

    const lastSeparator = computed(() => {
      return t('dashboard.details.header.authorLastSeparator')
    })

    const showSearchDialog = inject('showSearchDialog')

    function searchByAuthor (author, event) {
      event.preventDefault()

      const query = `${t('dashboard.search.keywords.author')}:"${author}"`
      showSearchDialog(query)
    }

    const canEdit = computed(() => store.getters['sheet/canEdit'])
    const ownerDisplayName = computed(() => store.getters['sheet/ownerDisplayName'])
    const ownerPictureUrl = computed(() => store.getters['sheet/ownerPictureUrl'])
    const shared = computed(() => store.getters['sheet/shared'])

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
      spoilerMode,
      blurSynopsis,
      externalLinks,
      separator,
      lastSeparator,
      searchByAuthor,
      canEdit,
      ownerDisplayName,
      ownerPictureUrl,
      shared
    }
  }
}
</script>

<style lang="postcss" scoped>
.book-title {
  @apply font-semibold font-display
    text-2xl md:text-3xl dark:text-gray-100;
}

.author-list {
  @apply font-medium text-gray-500 dark:text-gray-400 text-base md:text-lg;
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

.author:hover {
  @apply underline underline-offset-1 decoration-2
    decoration-primary-600 dark:decoration-primary-400;
}

.owner-badge {
  @apply flex items-center space-x-3 sm:w-64 rounded-md
    px-2.5 py-2 border border-gray-200 dark:border-gray-700;
}

.owner-info {
  @apply min-w-0 flex-grow;
}

.owner-title {
  @apply uppercase text-xxs font-bold tracking-wide block
    leading-none w-full truncate
    text-gray-500 dark:text-gray-400;
}

.owner-name {
  @apply text-sm font-medium w-full truncate leading-none mt-1
    text-gray-700 dark:text-gray-300;
}

.user-group {
  @apply shrink-0 pr-1 text-gray-400 dark:text-gray-500 ;
}

.book-external-link {
  @apply flex items-center px-2 py-1
    mr-2 mt-2 space-x-1.5 rounded-full
    bg-gray-100 dark:bg-gray-700
    text-gray-600 dark:text-gray-300
    text-xs uppercase tracking-wide font-semibold;
}

.book-external-link:hover,
.book-external-link:focus-visible {
  @apply text-gray-800 dark:text-gray-100;
}

.book-external-link:hover {
  @apply bg-gray-200 dark:bg-gray-600;
}

.book-external-link:focus-visible {
  @apply dark:ring-offset-gray-900;
}

.book-external-link .icon svg {
  @apply w-4 h-4;
}

.book-external-link svg {
  @apply text-gray-500 dark:text-gray-400;
}

.book-external-link:hover svg,
.book-external-link:focus-visible svg {
  @apply text-gray-600 dark:text-gray-300;
}
</style>
