<script lang="ts" setup>
import { ChevronRightIcon, HomeIcon } from '@heroicons/vue/20/solid'
import type Book from '@/model/Book'
import { ShowSearchDialogKey } from '@/symbols'
import { injectStrict } from '@/util'

export interface BookBreadcrumbProps {
  book: Book | null | undefined
  loading?: boolean
  hideHome?: boolean
}

const props = withDefaults(defineProps<BookBreadcrumbProps>(), {
  book: undefined,
  loading: false,
  hideHome: false,
})

const { t } = useI18n({ useScope: 'global' })
const { book } = toRefs(props)

const showSearchDialog = injectStrict(ShowSearchDialogKey, (_) => {})

function showCollection() {
  const keywords = {
    [t('dashboard.search.keywords.title')]: `${book.value!.titleParts.title} #`,
    [t('dashboard.search.keywords.publisher')]: book.value!.publisher,
    [t('dashboard.search.keywords.group')]: book.value!.group,
  }

  const queryString = Object.entries(keywords)
    .map(([keyword, value]) => `${keyword}:"${value}"`)
    .join(' ')

  showSearchDialog(queryString)
}
</script>

<template>
  <nav
    v-if="!loading"
    class="text-sm font-medium text-gray-500 dark:text-gray-300"
  >
    <ul class="flex space-x-1 md:space-x-3 items-center">
      <li v-if="!hideHome" class="shrink-0">
        <RouterLink
          :to="{ name: 'dashboard' }"
          :title="t('app.routes.dashboard.home')"
          class="w-5 h-5 block hover:text-gray-700 dark:hover:text-gray-100 focus-visible:text-gray-700 dark:focus-visible:text-gray-100 has-ring-focus dark:focus-visible:ring-offset-gray-800 rounded"
        >
          <span aria-hidden="true">
            <HomeIcon class="w-5 h-5" />
          </span>
          <span class="sr-only">
            {{ t('app.routes.dashboard.home') }}
          </span>
        </RouterLink>
      </li>
      <li v-if="!hideHome" aria-hidden="true" class="shrink-0">
        <ChevronRightIcon class="h-5 w-5 text-gray-400" />
      </li>
      <li class="shrink-0">
        <RouterLink
          :to="{ name: 'dashboard-library' }"
          class="hover:text-gray-700 dark:hover:text-gray-100 focus-visible:text-gray-700 dark:focus-visible:text-gray-100 has-ring-focus rounded dark:focus-visible:ring-offset-gray-900"
        >
          {{ t('dashboard.details.header.library') }}
        </RouterLink>
      </li>
      <li aria-hidden="true" class="shrink-0">
        <ChevronRightIcon class="h-5 w-5 text-gray-400" />
      </li>
      <li class="shrink-0">
        <RouterLink
          :to="{ name: 'dashboard-library', query: { group: book!.group } }"
          class="hover:text-gray-700 dark:hover:text-gray-100 focus-visible:text-gray-700 dark:focus-visible:text-gray-100 has-ring-focus rounded dark:focus-visible:ring-offset-gray-900"
        >
          {{ book!.group }}
        </RouterLink>
      </li>
      <li
        v-if="book!.titleParts.number && !hideHome"
        aria-hidden="true"
        class="shrink-0"
      >
        <ChevronRightIcon class="h-5 w-5 text-gray-400" />
      </li>
      <li v-if="book!.titleParts.number && !hideHome" class="grow">
        <a
          href="#"
          class="hover:text-gray-700 dark:hover:text-gray-100 focus-visible:text-gray-700 dark:focus-visible:text-gray-100 has-ring-focus rounded dark:focus-visible:ring-offset-gray-900"
          @click.prevent="showCollection"
        >
          {{ book!.titleParts.title }}
        </a>
      </li>
    </ul>
  </nav>
  <div v-else class="skeleton h-5 w-44" />
</template>
