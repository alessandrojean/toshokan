<script lang="ts" setup>
import {
  ArrowTopRightOnSquareIcon,
  BookmarkIcon as BookmarkSolidIcon,
  GlobeAltIcon,
  PencilIcon,
  StarIcon as StarSolidIcon,
} from '@heroicons/vue/20/solid'
import {
  BookmarkIcon as BookmarkOutlineIcon,
  ClockIcon,
  ShareIcon,
  StarIcon as StarOutlineIcon,
  TrashIcon,
} from '@heroicons/vue/24/outline'
import { useI18n } from '@/i18n'
import type Book from '@/model/Book'
import getBookLinks from '@/services/links'
import { ShowSearchDialogKey } from '@/symbols'
import { injectStrict } from '@/util'

export interface BookInformationProps {
  book: Book | null | undefined
  disabled?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<BookInformationProps>(), {
  book: undefined,
  disabled: false,
  loading: false,
})

defineEmits<{
  (e: 'click:edit', event: MouseEvent): void
  (e: 'click:delete', event: MouseEvent): void
  (e: 'click:toggleFavorite', event: MouseEvent): void
  (e: 'click:toggleStatus', event: MouseEvent): void
  (e: 'click:updateCover', event: MouseEvent): void
  (e: 'click:share', event: MouseEvent): void
}>()

const { book, loading } = toRefs(props)
const { t, d, locale } = useI18n({ useScope: 'global' })
const settingsStore = useSettingsStore()
const sheetStore = useSheetStore()

const showBookInfo = computed(() => {
  return !loading.value && book.value
})

const { renderMarkdown } = useMarkdown({ disable: ['image'] })

const synopsisRendered = computed(() => {
  if (!showBookInfo.value) {
    return ''
  }

  if (book.value!.synopsis!.length === 0) {
    return `<em>${t('book.emptySynopsis')}</em>`
  }

  return renderMarkdown(book.value!.synopsis!)
})

const { data: timeZone } = useTimeZoneQuery({
  enabled: computed(() => sheetStore.sheetId !== null),
})

function formatDate(date: Date, format = 'short') {
  if (date instanceof Date) {
    // @ts-expect-error missing types
    return d(date, format, { timeZone: timeZone.value.name })
  }

  return t('dashboard.details.info.dateUnknown')
}

const createdAt = computed(() => {
  return showBookInfo.value && book.value!.createdAt
    ? formatDate(book.value!.createdAt, 'long')
    : ''
})

const updatedAt = computed(() => {
  return showBookInfo.value && book.value!.updatedAt
    ? formatDate(book.value!.updatedAt, 'long')
    : ''
})

const spoilerMode = computed(() => settingsStore.spoilerMode)

const blurSynopsis = computed(() => {
  return (
    showBookInfo.value
    && spoilerMode.value.synopsis
    && !book.value!.isRead
    && book.value!.synopsis!.length > 0
  )
})

const externalLinks = computed(() => {
  return getBookLinks(book.value!, locale.value)
})

const separator = computed(() => {
  return t('dashboard.details.header.authorSeparator')
})

const lastSeparator = computed(() => {
  return t('dashboard.details.header.authorLastSeparator')
})

const showSearchDialog = injectStrict(ShowSearchDialogKey)

function searchByAuthor(author: string, event: MouseEvent) {
  event.preventDefault()

  const query = `${t('dashboard.search.keywords.author')}:"${author}"`
  showSearchDialog(query)
}

const canEdit = computed(() => sheetStore.canEdit)
</script>

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
      <h2 v-if="showBookInfo" class="book-title">
        <span v-if="book!.isFuture" aria-hidden="true">
          <ClockIcon
            class="w-5 h-5 mr-0.5 align-baseline inline-block text-gray-400 dark:text-gray-500"
          />
        </span>
        {{ book!.titleParts.main }}
      </h2>
      <div v-else class="skeleton w-72 h-8 mb-2" />

      <!-- Book subtitle -->
      <p
        v-if="showBookInfo && book!.titleParts.subtitle"
        class="italic font-medium font-display-safe text-md md:text-xl text-gray-700 dark:text-gray-300 -mt-1 mb-2"
      >
        {{ book!.titleParts.subtitle }}
      </p>

      <!-- Book authors -->
      <p v-if="showBookInfo" class="author-list">
        <template v-for="(author, idx) of book!.authors" :key="idx">
          <a
            href="#"
            class="author has-ring-focus"
            @click.prevent="searchByAuthor(author, $event)"
          >
            {{ author }}
          </a>
          <span
            v-if="book!.authors!.length > 1 && idx < book!.authors!.length - 1"
          >
            {{ idx === book!.authors!.length - 2 ? lastSeparator : separator }}
          </span>
        </template>
      </p>
      <div v-else class="skeleton h-6 w-44" />
    </div>

    <!-- Book synopsis -->
    <div
      v-if="showBookInfo"
      :class="
        blurSynopsis
          ? 'md:blur-sm md:dark:blur md:select-none md:hover:blur-none md:dark:hover:blur-none md:hover:select-auto'
          : ''
      "
      class="prose prose-sm md:prose-base dark:prose-invert leading-normal max-w-none"
      v-html="synopsisRendered"
    />
    <div v-else class="flex flex-col space-y-2">
      <div class="skeleton w-full h-5" />
      <div class="skeleton w-full h-5" />
      <div class="skeleton w-full h-5" />
      <div class="skeleton w-full h-5" />
      <div class="skeleton w-full h-5" />
      <div class="skeleton w-6/12 h-5" />
    </div>

    <!-- Book actions -->
    <div v-if="canEdit" class="flex space-x-2">
      <Button
        v-if="showBookInfo"
        kind="primary"
        size="large"
        class="justify-center md:justify-start flex-1 md:flex-initial"
        :disabled="disabled"
        @click="$emit('click:edit', $event)"
      >
        <template #left="{ iconClass }">
          <PencilIcon :class="iconClass" />
        </template>
        <span>{{ t('dashboard.details.header.edit') }}</span>
      </Button>
      <div v-else class="skeleton flex-1 md:flex-initial md:w-28 h-11" />

      <Button
        v-if="showBookInfo && !book!.isFuture"
        v-slot="{ iconClass }"
        size="large"
        icon-only
        :disabled="disabled"
        :title="
          t('dashboard.details.header.options.markAs', {
            status: t(book!.isRead ? 'book.unread' : 'book.read').toLowerCase(),
          })
        "
        @click="$emit('click:toggleStatus', $event)"
      >
        <BookmarkSolidIcon v-if="book!.isRead" :class="iconClass" />
        <BookmarkOutlineIcon v-else :class="iconClass" />
      </Button>

      <Button
        v-if="showBookInfo"
        v-slot="{ iconClass }"
        size="large"
        icon-only
        :disabled="disabled"
        :title="
          t(
            `dashboard.details.header.options.${
              book!.favorite ? 'removeFromFavorites' : 'addToFavorites'
            }`,
          )
        "
        @click="$emit('click:toggleFavorite', $event)"
      >
        <StarSolidIcon v-if="book!.favorite" :class="iconClass" />
        <StarOutlineIcon v-else :class="iconClass" />
      </Button>

      <Button
        v-if="showBookInfo"
        v-slot="{ iconClass }"
        size="large"
        icon-only
        :disabled="disabled"
        :title="t('dashboard.details.header.options.share')"
        @click="$emit('click:share', $event)"
      >
        <ShareIcon :class="iconClass" />
      </Button>

      <Button
        v-if="showBookInfo"
        v-slot="{ iconClass }"
        size="large"
        icon-only
        :disabled="disabled"
        :title="t('dashboard.details.header.options.delete')"
        @click="$emit('click:delete', $event)"
      >
        <TrashIcon :class="iconClass" />
      </Button>
    </div>

    <!-- Book metadata -->
    <div
      class="space-y-4 pt-4 border-t border-gray-300 dark:border-gray-600 text-xs md:text-sm text-gray-600 dark:text-gray-300"
    >
      <dl v-if="showBookInfo" class="space-y-1">
        <div v-if="book!.codeType !== 'N/A'" class="flex">
          <dt
            class="shrink sm:shrink-0 sm:w-48 text-gray-500 dark:text-gray-400"
          >
            {{ book!.codeType }}
          </dt>
          <dd class="grow text-right sm:text-left">
            {{ book!.code }}
          </dd>
        </div>
        <div class="flex">
          <dt
            class="shrink sm:shrink-0 sm:w-48 text-gray-500 dark:text-gray-400"
          >
            {{ t('book.properties.createdAt') }}
          </dt>
          <dd class="tabular-nums grow text-right sm:text-left">
            <time :datetime="book!.createdAt!.toISOString()">
              {{ createdAt }}
            </time>
          </dd>
        </div>
        <div class="flex">
          <dt
            class="shrink sm:shrink-0 sm:w-48 text-gray-500 dark:text-gray-400"
          >
            {{ t('book.properties.updatedAt') }}
          </dt>
          <dd class="tabular-nums grow text-right sm:text-left">
            <time :datetime="book!.updatedAt!.toISOString()">
              {{ updatedAt }}
            </time>
          </dd>
        </div>
      </dl>
      <div v-else class="flex flex-col space-y-1">
        <div class="skeleton w-44 h-4" />
        <div class="skeleton w-52 h-4" />
        <div class="skeleton w-64 h-4" />
      </div>

      <FadeTransition>
        <ul
          v-if="showBookInfo && externalLinks.length > 0"
          class="flex flex-wrap"
        >
          <li v-for="link in externalLinks" :key="link.url">
            <a
              class="book-external-link group has-ring-focus"
              target="_blank"
              :href="link.url"
            >
              <span aria-hidden="true" class="icon">
                <component :is="link.icon" v-if="link.icon" />
                <GlobeAltIcon v-else />
              </span>
              <span>{{ link.title }}</span>
              <span aria-hidden="true">
                <ArrowTopRightOnSquareIcon class="w-3.5 h-3.5 ext-icon" />
              </span>
            </a>
          </li>
        </ul>
      </FadeTransition>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.book-title {
  @apply font-semibold font-display-safe
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
