<script lang="ts" setup>
import type { _RouterLinkI } from 'vue-router'

import { BookmarkIcon, ClockIcon } from '@heroicons/vue/20/solid'
import {
  BookOpenIcon,
  ExclamationCircleIcon,
  EyeSlashIcon,
} from '@heroicons/vue/24/outline'
import type Book from '@/model/Book'
import type { GridMode, SpoilerMode } from '@/stores/settings'

export interface BookCardProps {
  blurNsfw?: boolean
  book?: Book
  current?: boolean
  imageOnly?: boolean
  loading?: boolean
  mode?: GridMode
  spoilerMode?: SpoilerMode
  tabindex?: string
}

const props = withDefaults(defineProps<BookCardProps>(), {
  blurNsfw: false,
  book: undefined,
  current: false,
  imageOnly: false,
  loading: false,
  mode: 'comfortable',
  spoilerMode: () => ({
    cover: false,
    synopsis: false,
  }),
  tabindex: undefined,
})

const { book, loading, mode, spoilerMode, blurNsfw } = toRefs(props)
const { t } = useI18n({ useScope: 'global' })

const thumbnailUrl = computed(() => {
  return book.value
    ? book.value.coverUrl?.replace('_SL700_', '_SL300_') ?? ''
    : ''
})

const loadedCard = ref<HTMLDivElement | InstanceType<_RouterLinkI>>()

const { imageHasError, imageLoading, setupObserver, observerCreated }
  = useImageLazyLoader(thumbnailUrl, loadedCard)

const volume = computed(() => {
  if (!book.value) {
    return ''
  }

  const isSingle = book.value.titleParts.number === null

  return isSingle
    ? t('book.single')
    : t('book.volume', { number: book.value.titleParts.number })
})

onMounted(() => {
  if (!loading.value && book.value) {
    setupObserver()
  }
})

watch(loading, (newValue) => {
  if (!newValue && !observerCreated.value) {
    setupObserver()
  }
})

const blurCover = computed(() => {
  return (
    (spoilerMode.value.cover && !book.value?.isRead)
    || (blurNsfw.value && book.value?.isNsfw)
  )
})
</script>

<template>
  <div v-if="loading">
    <div class="skeleton shadow rounded-xl aspect-w-2 aspect-h-3">
      <div class="w-full h-full flex justify-center items-center">
        <BookOpenIcon
          class="w-10 h-10 text-gray-50 dark:text-gray-500"
          aria-hidden="true"
        />
      </div>
      <div
        v-if="mode === 'compact' && !imageOnly"
        class="absolute top-0 left-0 w-full h-full flex items-start justify-end flex-col pb-2 px-2 lg:pb-3 lg:px-3 space-y-2"
      >
        <div class="bg-gray-50 dark:bg-gray-500 h-4 w-3/4 rounded" />
        <div class="bg-gray-50 dark:bg-gray-500 h-3 w-1/2 rounded" />
      </div>
    </div>
    <div v-if="mode === 'comfortable' && !imageOnly" class="mt-3 space-y-1">
      <div class="skeleton h-4 w-3/4 rounded" />
      <div class="skeleton h-3 w-1/2 rounded" />
    </div>
  </div>
  <component
    :is="imageOnly ? 'div' : 'RouterLink'"
    v-else
    ref="loadedCard"
    :to="
      !imageOnly
        ? { name: 'dashboard-library-book-id', params: { id: book?.id ?? '' } }
        : undefined
    "
    class="book-link group focus:outline-none relative"
    :title="!imageOnly ? book?.title ?? '' : undefined"
    :aria-current="current && !imageOnly ? 'page' : undefined"
    :tabindex="!imageOnly ? tabindex : undefined"
  >
    <component
      :is="imageOnly ? 'RouterLink' : 'div'"
      :class="blurCover ? 'blurred' : ''"
      :to="
        imageOnly
          ? {
            name: 'dashboard-library-book-id',
            params: { id: book?.id ?? '' },
          }
          : undefined
      "
      class="book-card !outline-none has-ring-focus dark:focus-visible:ring-offset-gray-900"
      :aria-current="current && imageOnly ? 'page' : undefined"
      :tabindex="imageOnly ? tabindex : undefined"
      :title="imageOnly ? book?.title ?? '' : undefined"
    >
      <FadeTransition>
        <div
          v-if="imageLoading || imageHasError"
          class="w-full h-full flex justify-center items-center"
          aria-hidden="true"
        >
          <BookOpenIcon
            v-if="loading || imageLoading || thumbnailUrl.length === 0"
            :class="[
              imageLoading ? 'motion-safe:animate-pulse' : '',
              'w-10 h-10 text-gray-400 dark:text-gray-500',
            ]"
            aria-hidden="true"
          />
          <ExclamationCircleIcon
            v-else
            class="w-10 h-10 text-gray-400 dark:text-gray-500"
          />
        </div>
        <div v-else class="book-cover-wrapper" aria-hidden="true">
          <img
            :class="['book-cover', blurCover ? 'is-spoiler' : '']"
            :src="thumbnailUrl"
          >

          <div
            v-if="blurCover"
            class="absolute inset-0 flex items-center justify-center cover-eye"
          >
            <EyeSlashIcon class="w-8 h-8 text-gray-800 opacity-60" />
          </div>
        </div>
      </FadeTransition>

      <div
        v-if="(book?.isRead || current || book?.isFuture) && !imageOnly"
        class="badge-wrapper"
      >
        <span v-if="current" class="current-volume">
          {{ t('book.currentVolume') }}
        </span>
        <template
          v-if="!book?.isFuture && book?.isRead && mode === 'comfortable'"
        >
          <span class="sr-only">{{ t('book.read') }}</span>
          <div
            class="bg-white dark:bg-primary-50 dark:bg-opacity-95 rounded p-0.5 self-end ml-auto"
          >
            <BookmarkIcon class="w-4 h-4 text-primary-500" />
          </div>
        </template>
        <span v-else-if="!current && book?.isFuture" class="future-item">
          <span aria-hidden="true">
            <ClockIcon class="w-3.5 h-3.5" />
          </span>
          <span>
            {{ t('book.future') }}
          </span>
        </span>
      </div>

      <FadeTransition>
        <div
          v-if="
            (mode === 'compact' && !imageOnly) || (imageOnly && imageHasError)
          "
          :class="[
            'book-gradient absolute top-0 left-0 w-full h-full flex justify-end py-2 px-2 lg:pb-3 lg:px-3',
            imageOnly && imageHasError ? 'items-start' : 'items-end',
            imageOnly ? 'image-only' : '',
          ]"
        >
          <div class="inline-flex text-white w-full items-center">
            <div class="inline-flex flex-col grow min-w-0">
              <span
                class="font-semibold font-display-safe text-[0.8rem] sm:text-sm truncate max-w-full"
              >
                {{ book?.titleParts?.title }}
              </span>
              <span class="font-medium text-xxs sm:text-xs">
                {{ volume }}
              </span>
            </div>
            <div
              v-if="!book?.isFuture && book?.isRead"
              class="shrink-0 bg-white dark:bg-primary-50 dark:bg-opacity-95 rounded p-0.5 mt-px ml-1 sm:ml-2"
            >
              <BookmarkIcon class="w-4 h-4 text-primary-500" />
            </div>
          </div>
        </div>
      </FadeTransition>
    </component>

    <div
      v-if="$slots.actions"
      class="w-full relative -mt-4 flex justify-center motion-safe:transition actions"
    >
      <slot name="actions" />
    </div>

    <div v-if="mode === 'comfortable' && !imageOnly" class="mt-3">
      <p
        class="text-[0.8rem] sm:text-sm font-display-safe font-semibold truncate text-gray-900 dark:text-gray-200"
      >
        {{ book?.titleParts?.title }}
      </p>
      <p
        class="text-xxs sm:text-xs font-medium truncate text-gray-600 dark:text-gray-400"
      >
        {{ volume }}
      </p>
    </div>
  </component>
</template>

<style lang="postcss" scoped>
.book-card {
  will-change: transform, box-shadow;
  @apply relative shadow rounded-xl overflow-hidden block
    bg-gray-200 dark:bg-gray-700
    aspect-w-2 aspect-h-3
    motion-safe:transition-all;
}

.book-link:focus-visible .book-card {
  @apply ring-2 ring-offset-2 ring-primary-500 dark:ring-offset-gray-900;
}

.book-link:where(:hover, :focus-visible) .book-card {
  @apply md:shadow-lg md:-translate-y-1;
}

.book-gradient {
  background-image: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.7) 0%,
    transparent 60%
  );
}

.book-gradient.image-only {
  background-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.7) 0%,
    transparent 60%
  );
}

.book-cover-wrapper {
  @apply w-full h-full overflow-hidden;
}

.book-cover {
  @apply object-cover w-full h-full;
}

.book-cover.is-spoiler {
  @apply blur scale-105;
}

.current-volume,
.future-item {
  @apply px-1.5 py-0.5 rounded backdrop-blur
    text-xs font-semibold tracking-wide
    bg-gray-800/80 text-gray-100;
}

.future-item {
  @apply flex items-center space-x-1.5;
}

.badge-wrapper {
  @apply p-2 absolute inset-0 flex justify-start items-start
    bg-gray-900 dark:bg-gray-800
    bg-opacity-20 dark:bg-opacity-60;
}

.book-card.blurred :where(.book-cover, .cover-eye) {
  @apply md:motion-safe:transition-all md:motion-safe:ease-in;
}

.book-card.blurred:hover .book-cover {
  @apply md:blur-0 md:scale-100 md:motion-safe:duration-[2000ms];
}

.book-card.blurred:hover .cover-eye {
  @apply md:opacity-0 md:motion-safe:duration-[2000ms];
}
</style>
