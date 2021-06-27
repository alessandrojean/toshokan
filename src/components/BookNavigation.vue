<template>
  <div class="grid grid-cols-2 gap-6" v-if="showNavigation">
    <div class="motion-safe:animate-pulse bg-gray-50 shadow rounded-md dark:bg-gray-700 h-12 sm:h-20" v-if="loading"></div>
    <router-link
      v-else-if="previousBook && Object.keys(previousBook).length > 0"
      class="group shadow bg-white dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md p-3 flex items-center hover:shadow-md motion-safe:transition-shadow active:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 dark:focus-visible:ring-offset-gray-900 focus-visible:ring-indigo-500"
      :to="{ name: 'BookDetails', params: { bookId: previousBook.id } }"
    >
      <ChevronLeftIcon class="text-gray-400 w-7 h-6 sm:h-10 mr-2 group-hover:text-indigo-500 dark:group-hover:text-gray-200" />
      <div class="flex flex-col flex-1 truncate">
        <p class="font-semibold text-sm max-w-full truncate hidden sm:block dark:text-gray-100">{{ previousBook.titleParts[0] }}</p>
        <p class="text-current text-sm font-medium sm:font-normal sm:text-gray-500 sm:text-xs sm:dark:text-gray-400 dark:text-gray-200">Volume #{{ previousBook.titleParts[1] }}</p>
      </div>
    </router-link>

    <div class="motion-safe:animate-pulse bg-gray-50 shadow rounded-md dark:bg-gray-700 h-12 sm:h-20" v-if="loading"></div>
    <router-link
      v-else-if="nextBook && Object.keys(nextBook).length > 0"
      :class="[
        !previousBook ? 'col-start-2' : '',
        'group shadow bg-white dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md p-3 flex items-center hover:shadow-md motion-safe:transition-shadow active:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 dark:focus-visible:ring-offset-gray-900 focus-visible:ring-indigo-500'
      ]"
      :to="{ name: 'BookDetails', params: { bookId: nextBook.id } }"
    >
      <div class="flex flex-col items-end flex-1 truncate">
        <p class="font-semibold text-sm max-w-full truncate hidden sm:block dark:text-gray-100">{{ nextBook.titleParts[0] }}</p>
        <p class="text-current text-sm font-medium sm:font-normal sm:text-gray-500 sm:text-xs sm:dark:text-gray-400 dark:text-gray-200">Volume #{{ nextBook.titleParts[1] }}</p>
      </div>
      <ChevronRightIcon class="text-gray-400 w-7 h-6 sm:h-10 ml-2 group-hover:text-indigo-500 dark:group-hover:text-gray-200" />
    </router-link>
  </div>
</template>

<script>
import { computed, toRefs } from 'vue'

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/outline'

export default {
  name: 'BookNavigation',

  components: {
    ChevronLeftIcon,
    ChevronRightIcon
  },

  props: {
    loading: Boolean,
    previousBook: Object,
    nextBook: Object
  },

  setup (props) {
    const { previousBook, nextBook } = toRefs(props)

    const showNavigation = computed(() => {
      return (previousBook.value && Object.keys(previousBook.value).length > 0) ||
        (nextBook.value && Object.keys(nextBook.value).length > 0)
    })

    return { showNavigation }
  }
}
</script>
