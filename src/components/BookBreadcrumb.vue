<template>
  <nav v-if="!loading" class="text-sm font-medium text-gray-500 dark:text-gray-300">
    <ul class="flex space-x-1 md:space-x-3 items-center">
      <li v-if="!hideHome">
        <router-link
          :to="{ name: 'DashboardHome' }"
          :title="t('app.routes.dashboard.home')"
          class="w-5 h-5 block hover:text-gray-700 dark:hover:text-gray-100 focus:text-gray-700 dark:focus:text-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 dark:focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800 rounded motion-safe:transition-shadow"
        >
          <span aria-hidden="true">
            <HomeIcon class="w-5 h-5" />
          </span>
          <span class="sr-only">
            {{ t('app.routes.dashboard.home') }}
          </span>
        </router-link>
      </li>
      <li aria-hidden="true" v-if="!hideHome">
        <ChevronRightIcon class="h-5 w-5 text-gray-400" />
      </li>
      <li>
        <router-link
          :to="{ name: 'DashboardLibrary' }"
          class="hover:text-gray-700 dark:hover:text-gray-100 focus:text-gray-700 dark:focus:text-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 dark:focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800 rounded motion-safe:transition-shadow"
        >
          {{ t('dashboard.details.header.library') }}
        </router-link>
      </li>
      <li aria-hidden="true">
        <ChevronRightIcon class="h-5 w-5 text-gray-400" />
      </li>
      <li>
        <router-link
          :to="{ name: 'DashboardLibrary', query: { group: book.group } }"
          class="hover:text-gray-700 dark:hover:text-gray-100 focus:text-gray-700 dark:focus:text-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 dark:focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800 rounded motion-safe:transition-shadow"
        >
          {{ book.group }}
        </router-link>
      </li>
      <li aria-hidden="true" v-if="book.titleParts[1] && !hideHome">
        <ChevronRightIcon class="h-5 w-5 text-gray-400" />
      </li>
      <li v-if="book.titleParts[1] && !hideHome">
        {{ book.titleParts[0] }}
      </li>
    </ul>
  </nav>
  <div v-else class="motion-safe:animate-pulse h-5 bg-gray-400 dark:bg-gray-600 rounded w-44"></div>
</template>

<script>
import { useI18n } from 'vue-i18n'

import { ChevronRightIcon, HomeIcon } from '@heroicons/vue/solid'

export default {
  components: {
    ChevronRightIcon,
    HomeIcon
  },

  props: {
    book: Object,
    loading: Boolean,
    hideHome: Boolean
  },

  setup () {
    const { t } = useI18n()

    return { t }
  }
}
</script>
