<template>
  <div class="relative space-y-6">
    <form
      id="search-form"
      :aria-label="t('dashboard.newBook.autoFill.ariaLabel')"
      class="flex flex-col items-end"
      @submit.prevent="search"
    >
      <label for="book-isbn" id="isbn-search-label" class="sr-only">
        {{ t('dashboard.newBook.autoFill.label' )}}
      </label>
      <div class="group relative w-full search-field">
        <div class="search-icon" aria-hidden="true">
          <SearchIcon class="w-5 h-5" />
        </div>
        <input
          type="search"
          inputmode="numeric"
          id="book-isbn"
          class="input text-lg pl-10 md:pr-16 rounded-full"
          :placeholder="t('dashboard.newBook.autoFill.placeholder')"
          v-model="isbnQuery"
          @keyup.enter.prevent="search"
          aria-labelledby="isbn-search-label search-provider-info"
          ref="searchInput"
          :disabled="searching"
        >
        <div class="key-tooltip absolute right-3 inset-y-0 justify-center items-center" aria-hidden="true">
          <button
            type="submit"
            class="font-medium text-gray-400 dark:text-gray-300 text-xs leading-5 px-1.5 border border-gray-300 dark:border-gray-500 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-600 dark:focus-visible:ring-primary-500 dark:focus-visible:ring-offset-gray-700"
            :disabled="searching"
          >
            <kbd aria-hidden="true" class="font-sans">
              {{ t('dashboard.newBook.autoFill.enter') }}
            </kbd>
            <span class="sr-only">
              {{ t('dashboard.header.search.search' )}}
            </span>
          </button>
        </div>
      </div>
    </form>

    <transition
      mode="out-in"
      leave-active-class="motion-safe:transition duration-100 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
      enter-active-class="motion-safe:transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
    >
      <Alert
        v-if="!noResultsFound && !searchFailed && !searchResults"
        show
        type="info"
        :title="t('dashboard.newBook.autoFill.isbnAlert.title')"
      >
        <div
          class="prose-sm"
          v-html="renderMarkdown(t('dashboard.newBook.autoFill.isbnAlert.body'))"
        />

        <template v-slot:actions>
          <a
            :href="t('dashboard.newBook.autoFill.isbnAlert.wikipediaLink')"
            target="_blank"
          >
            {{ t('dashboard.newBook.autoFill.isbnAlert.additionalInfo') }}
          </a>
        </template>
      </Alert>

      <Alert
        v-else-if="!proceedAnyway && existInSheet && !loading"
        show
        type="warning"
        :title="t('dashboard.newBook.autoFill.existAlert.title')"
      >
        <div class="prose-sm">
          <p>
            {{ t('dashboard.newBook.autoFill.existAlert.body') }}
          </p>
        </div>

        <template v-slot:actions>
          <button @click="viewExisting">
            {{ t('dashboard.newBook.autoFill.existAlert.actionView') }}
          </button>

          <button @click="proceedAnyway = true">
            {{ t('dashboard.newBook.autoFill.existAlert.actionMakeCopy') }}
          </button>
        </template>
      </Alert>

      <div v-else-if="proceedAnyway && searchResults && searchResults.length > 0">
        <h3 class="text-gray-700 dark:text-gray-200 font-medium font-display">
          {{ t('dashboard.search.results') }}
        </h3>

        <BookSelector
          v-if="searchResults && searchResults.length > 0"
          :options="searchResults"
          @select="handleSearchSelect"
          class="mt-3"
        />
      </div>

      <Alert
        v-else-if="searchFailed"
        show
        type="error"
        :title="t('dashboard.newBook.autoFill.error')"
      >
        <p>{{ searchError }}</p>
      </Alert>

      <Alert
        v-else-if="noResultsFound"
        show
        type="info"
      >
        <p>{{ t('dashboard.newBook.autoFill.noResults') }}</p>
      </Alert>

    </transition>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { SearchIcon } from '@heroicons/vue/solid'

import Alert from '@/components/Alert.vue'
import BookSelector from '@/components/book/BookSelector.vue'

import useBookInserter from '@/composables/useBookInserter'
import useIsbnSearch from '@/composables/useIsbnSearch'
import useMarkdown from '@/composables/useMarkdown'

export default {
  components: {
    Alert,
    BookSelector,
    SearchIcon
  },

  emits: ['search', 'select', 'click:viewExisting'],

  setup (_, context) {
    const { t } = useI18n()

    const isbnQuery = ref('')
    const searchInput = ref(null)

    const {
      errorMessage: searchError,
      failed: searchFailed,
      noResultsFound,
      results: searchResults,
      search: isbnSearch,
      searching
    } = useIsbnSearch(isbnQuery)

    const { checkIfExists } = useBookInserter()

    function handleSearchSelect (selectedBook) {
      context.emit('select', selectedBook)
    }

    const loading = ref(false)

    async function search () {
      if (isbnQuery.value.length < 10) {
        return
      }

      context.emit('search', true)
      loading.value = true

      searchInput.value?.blur()
      await searchInSheet()
      await isbnSearch()

      context.emit('search', false)
      loading.value = false
    }

    const existInSheet = ref(false)
    const existingIds = ref(null)
    const proceedAnyway = ref(false)
    const searchingInSheet = ref(false)

    async function searchInSheet () {
      searchingInSheet.value = true
      existingIds.value = await checkIfExists(isbnQuery.value)
      existInSheet.value = existingIds.value && existingIds.value.length > 0
      proceedAnyway.value = !existInSheet.value
      searchingInSheet.value = false
    }

    const { renderMarkdown } = useMarkdown()

    function viewExisting () {
      context.emit('click:viewExisting', existingIds.value[0])
    }

    return {
      t,
      isbnQuery,
      searchInput,
      searchError,
      searchFailed,
      noResultsFound,
      searchResults,
      isbnSearch,
      searching,
      handleSearchSelect,
      search,
      existInSheet,
      existingIds,
      proceedAnyway,
      loading,
      renderMarkdown,
      viewExisting
    }
  }
}
</script>

<style lang="postcss" scoped>
#search-form .key-tooltip {
  @apply hidden;
}

#search-form:focus-within .key-tooltip {
  @apply md:flex;
}

input[type="search"]::-webkit-search-decoration,
input[type="search"]::-webkit-search-cancel-button,
input[type="search"]::-webkit-search-results-button,
input[type="search"]::-webkit-search-results-decoration {
  display: none;
}

.search-icon {
  @apply absolute inset-y-0 left-0 pl-3 text-gray-500
    flex items-center pointer-events-none;
}

.search-field:focus-within .search-icon {
  @apply dark:text-gray-300;
}
</style>
