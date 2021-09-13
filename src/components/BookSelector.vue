<template>
  <div class="flex flex-col space-y-2" v-if="options">
    <button
      v-for="book in options"
      :key="book.code"
      class="group rounded-md border dark:bg-gray-700 border-gray-300 dark:border-gray-700 dark:hover:border-gray-600 flex flex-col md:flex-row items-start md:items-center text-sm px-4 md:px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 dark:focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800 motion-safe:transition-shadow"
      @click="$emit('select', book)"
    >
      <div class="inline-flex flex-col text-left flex-1">
        <span class="block font-medium truncate dark:text-gray-200">
          {{ book.title }}
        </span>
        <span
          v-if="book.authors && book.authors.length > 0"
          class="block text-gray-500 dark:text-gray-300 truncate"
        >
          {{ formatAuthors(book.authors) }}
        </span>
      </div>
      <div class="mt-1 md:mt-0 inline-flex md:flex-col items-end space-x-2 md:space-x-0 md:space-y-0.5">
        <span class="text-xs bg-primary-100 dark:bg-gray-600 dark:group-hover:bg-gray-500 text-primary-600 dark:text-gray-200 dark:group-hover:text-gray-100 font-semibold px-2 py-0.5 rounded text uppercase tracking-wide">
          {{ book.provider }}
        </span>
        <span
          v-if="book.publisher && book.publisher.length > 0"
          class="block text-gray-500 dark:text-gray-300"
        >
          {{ book.publisher }}
        </span>
      </div>
    </button>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

export default {
  props: {
    options: Array
  },

  emits: ['select'],

  setup () {
    const { t } = useI18n()

    const separator = computed(() => {
      return t('dashboard.details.header.authorSeparator')
    })

    function formatAuthors (authors) {
      let formattedAuthors = (authors || []).join(separator)

      if (authors && authors.length >= 2) {
        const firstAuthors = (authors || [])
          .slice(0, -1)
          .join(separator.value)

        formattedAuthors = t(
          'dashboard.details.header.authorListComplete',
          {
            authors: firstAuthors,
            lastAuthor: authors[authors.length - 1]
          }
        )
      }

      return formattedAuthors
    }

    return { formatAuthors }
  }
}
</script>
