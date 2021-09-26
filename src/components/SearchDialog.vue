<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog
      as="div"
      class="fixed z-20 inset-0 flex flex-col items-center py-4 px-4 sm:py-6 sm:px-6 md:px-0 md:py-12 lg:py-24"
      @close="closeDialog"
    >
      <TransitionChild
        as="template"
        enter="motion-reduce:transition-none duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="motion-reduce:transition-none duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <DialogOverlay class="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-90 motion-safe:transition-opacity backdrop-filter backdrop-blur-sm" />
      </TransitionChild>

      <TransitionChild
        as="template"
        enter="motion-reduce:transition-none duration-300 ease-out"
        enter-from="opacity-0 scale-95"
        enter-to="opacity-100 scale-100"
        leave="motion-reduce:transition-none duration-200 ease-in"
        leave-from="opacity-100 scale-100"
        leave-to="opacity-0 scale-95"
      >
        <div class="flex flex-col w-full max-w-2xl overflow-hidden text-left motion-safe:transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
          <DialogTitle as="h3" class="sr-only">
            {{ t('dashboard.search.label') }}
          </DialogTitle>

          <form
            :class="[
              'py-4 md:py-6 mx-4 md:mx-6 flex items-center space-x-3 md:space-x-4',
              !searchLoading ? 'border-b border-gray-300 dark:border-gray-600' : ''
            ]"
            @submit.prevent="handleSearch"
          >
            <span aria-hidden="true" class="w-6 h-6 relative">
              <transition
                leave-active-class="transition motion-reduce:transition-none duration-200 ease-in"
                leave-from-class="opacity-200"
                leave-to-class="opacity-0"
                enter-active-class="transition motion-reduce:transition-none duration-200 ease-out"
                enter-from-class="opacity-0"
                enter-to-class="opacity-100"
              >
                <LoadingSpinIcon v-if="searchLoading" class="absolute w-6 h-6 animate-spin text-primary-600 dark:text-primary-400" />
                <SearchIcon v-else class="absolute w-6 h-6 text-primary-600 dark:text-primary-400 bg-white dark:bg-gray-800" />
              </transition>
            </span>

            <div class="flex-1">
              <label for="search-input" class="sr-only">
                {{ t('dashboard.search.label') }}
              </label>

              <input
                type="search"
                :value="searchQuery"
                @input="debounce(() => { searchQuery = $event.target.value })"
                id="search-input"
                ref="searchInput"
                class="w-full border-0 p-0 focus:ring-0 font-medium placeholder-gray-400 dark:placeholder-gray-500 dark:bg-gray-800 dark:text-gray-100 disabled:opacity-60"
                :placeholder="t('dashboard.search.placeholder')"
                @keyup.enter.prevent="search($event.target.value)"
              >
            </div>

            <transition
              mode="out-in"
              leave-active-class="transition motion-reduce:transition-none duration-200 ease-in"
              leave-from-class="opacity-200"
              leave-to-class="opacity-0"
              enter-active-class="transition motion-reduce:transition-none duration-100 ease-out"
              enter-from-class="opacity-0"
              enter-to-class="opacity-100"
            >
              <button
                type="reset"
                class="rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 focus:text-gray-800 dark:focus:text-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-600 dark:focus-visible:ring-primary-500 dark:focus-visible:ring-offset-gray-800 motion-safe:transition-shadow"
                v-if="!searchLoading && searchedOnce && searchQuery.length > 0"
                @click="clearSearch(true)"
              >
                <span aria-hidden="true">
                  <XIcon class="w-5 h-5" />
                </span>
                <span class="sr-only">
                  {{ t('dashboard.search.clear') }}
                </span>
              </button>
            </transition>

            <button
              type="button"
              class="hidden md:flex border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-300 text-sm px-1.5 py-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-600 dark:focus-visible:ring-primary-500 dark:focus-visible:ring-offset-gray-800 motion-safe:transition-shadow"
              @click="closeDialog"
            >
              <span class="sr-only">
                {{ t('dashboard.search.close') }}
              </span>
              <kbd aria-hidden="true" class="font-sans">
                esc
              </kbd>
            </button>
          </form>

          <transition
            v-if="!searchLoading"
            mode="out-in"
            leave-active-class="transition motion-reduce:transition-none duration-200 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
            enter-active-class="transition motion-reduce:transition-none duration-200 ease-out"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
          >
            <div
              v-if="searchResults.length > 0"
              tabindex="-1"
              ref="results"
              class="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 focus:outline-none"
            >
              <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 justify-between sm:items-center">
                <h3 class="text-gray-700 dark:text-gray-200 font-semibold font-display">
                  {{ t('dashboard.search.results') }}
                </h3>

                <div class="flex -space-x-px w-full sm:w-auto">
                  <div class="flex-1 sm:flex-initial sm:w-56">
                    <label for="search-sort-by" class="sr-only">
                      {{ t('dashboard.library.filters.sortBy') }}
                    </label>

                    <select
                      class="relative focus:z-10 select rounded-r-none w-full py-1.5 px-2.5"
                      v-model="sortBy"
                      id="search-sort-by"
                    >
                      <option
                        v-for="sortProperty in sortProperties"
                        :key="sortProperty.attr"
                        :value="sortProperty.attr"
                      >
                        {{ sortProperty.title }}
                      </option>
                    </select>
                  </div>

                  <button
                    class="relative focus:z-10 button is-icon-only px-2 py-1.5 rounded-l-none bg-gray-50 dark:bg-gray-800 dark:active:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-600 dark:active:border-gray-600 focus-visible:ring focus-visible:ring-offset-0 focus-visible:border-primary-500 dark:focus-visible:border-primary-500 focus-visible:ring-opacity-30 dark:focus-visible:ring-opacity-50"
                    @click="toggleSortDirection"
                  >
                    <span class="sr-only">
                      {{
                        t(
                          sortDirection === 'asc'
                            ? 'dashboard.library.filters.sortDirection.asc'
                            : 'dashboard.library.filters.sortDirection.desc'
                        )
                      }}
                    </span>
                    <span aria-hidden="true">
                      <SortAscendingIcon v-if="sortDirection === 'asc'" />
                      <SortDescendingIcon v-else />
                    </span>
                  </button>
                </div>
              </div>

              <ul class="divide-y divide-gray-200">
                <li
                  v-for="result in searchResults"
                  :key="result.id"
                  class="result"
                >
                  <SearchItem
                    :result="result"
                    @click="closeDialog"
                  />
                </li>
              </ul>
            </div>

            <div
              v-else-if="searchedOnce && searchResults.length === 0"
              class="py-10 mx-4 md:mx-6 mb-2 md:mb-0 md:text-lg text-gray-400 font-medium"
            >
              <i18n-t keypath="dashboard.search.noResultsFound" tag="p">
                <span class="text-gray-900 dark:text-gray-100">{{ searchedTerm }}</span>
              </i18n-t>
            </div>

            <div
              v-else-if="searchHistory.length > 0"
              class="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 focus:outline-none"
            >
              <h3 class="text-gray-700 dark:text-gray-200 font-semibold font-display">
                {{ t('dashboard.search.history') }}
              </h3>

              <ul class="space-y-2">
                <li
                  v-for="historyItem in searchHistory"
                  :key="historyItem"
                >
                  <SearchHistoryItem
                    :search="historyItem"
                    @click="search($event)"
                    @click:remove="removeHistoryItem($event)"
                  />
                </li>
              </ul>
            </div>

            <div
              v-else
              class="py-10 mx-4 md:mx-6 mb-2 md:mb-0 md:text-lg text-gray-400 font-medium"
            >
              <p>{{ t('dashboard.search.noHistory') }}</p>
            </div>
          </transition>

          <transition
            mode="out-in"
            leave-active-class="transition motion-reduce:transition-none duration-200 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
            enter-active-class="transition motion-reduce:transition-none duration-200 ease-out"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
          >
            <div
              v-if="!searchLoading && searchedOnce && searchResults.length > 0"
              class="border-t border-gray-300 dark:border-gray-600 text-xs text-gray-600 dark:text-gray-300 font-medium py-4 md:py-5 mx-4 md:mx-6"
            >
              {{ t('dashboard.search.resultCount', searchResults.length) }}
            </div>
          </transition>
        </div>
      </TransitionChild>
    </Dialog>
  </TransitionRoot>
</template>

<script>
import { computed, ref, toRefs, watch } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

import {
  Dialog,
  DialogOverlay,
  DialogTitle,
  TransitionChild,
  TransitionRoot
} from '@headlessui/vue'

import {
  SortAscendingIcon,
  SortDescendingIcon,
  XIcon
} from '@heroicons/vue/solid'
import { SearchIcon } from '@heroicons/vue/outline'

import LoadingSpinIcon from '@/components/icons/LoadingSpinIcon.vue'
import SearchHistoryItem from '@/components/SearchHistoryItem.vue'
import SearchItem from '@/components/SearchItem.vue'

import { MutationTypes } from '@/store'

export default {
  components: {
    Dialog,
    DialogOverlay,
    DialogTitle,
    TransitionChild,
    TransitionRoot,
    SearchHistoryItem,
    SearchIcon,
    SearchItem,
    SortAscendingIcon,
    SortDescendingIcon,
    XIcon,
    LoadingSpinIcon
  },

  props: {
    isOpen: Boolean
  },

  emits: ['close'],

  setup (props, context) {
    const { t, locale } = useI18n()

    const store = useStore()

    const loading = computed(() => store.state.sheet.loading)

    const searchQuery = ref('')
    const searchedOnce = ref(false)
    const searchedTerm = ref('')
    const searchLoading = computed(() => store.state.collection.search.loading)
    const searchResults = computed(() => store.state.collection.search.results)
    const searchHistory = computed(() => store.state.collection.search.history)

    const searchInput = ref(null)
    const results = ref(null)

    function clearSearch (focusOnInput) {
      searchQuery.value = ''
      searchedOnce.value = false
      searchedTerm.value = ''

      store.commit(MutationTypes.COLLECTION_CLEAR_SEARCH)

      if (focusOnInput) {
        searchInput.value?.focus()
      }
    }

    function closeDialog () {
      context.emit('close')

      setTimeout(() => clearSearch(), 300)
    }

    async function search (query) {
      const searchTerm = query || searchQuery.value

      if (!loading.value && !searchLoading.value && searchTerm.length > 0) {
        searchInput.value?.blur()

        await store.dispatch('collection/search', { query: searchTerm })

        if (searchResults.value.length > 0 && query) {
          results.value?.focus()
        } else {
          searchInput.value?.focus()
        }

        searchQuery.value = searchTerm
        searchedOnce.value = true
        searchedTerm.value = searchTerm
      }
    }

    async function handleSubmit () {
      await search()
    }

    const { isOpen } = toRefs(props)

    watch(isOpen, newIsOpen => {
      if (newIsOpen) {
        searchInput.value?.focus()
      }
    })

    function createDebounce () {
      let timeout = null

      return function (fn, delayMs) {
        clearTimeout(timeout)
        timeout = setTimeout(() => { fn() }, delayMs || 1000)
      }
    }

    watch(searchQuery, async (newQuery, oldQuery) => {
      if (newQuery.length > 0 && !searchLoading.value && newQuery !== oldQuery) {
        await search()
      }
    })

    const sortBy = computed({
      get: () => store.state.collection.search.sortBy,
      set: async val => {
        store.commit(MutationTypes.COLLECTION_UPDATE_SEARCH, { sortBy: val })
        await search()
      }
    })

    const sortDirection = computed({
      get: () => store.state.collection.search.sortDirection,
      set: async val => {
        store.commit(MutationTypes.COLLECTION_UPDATE_SEARCH, { sortDirection: val })
        await search()
      }
    })

    function toggleSortDirection () {
      sortDirection.value = sortDirection.value === 'desc' ? 'asc' : 'desc'
    }

    const sortProperties = computed(() => {
      const properties = [
        { attr: 'title', title: t('book.properties.title') },
        { attr: 'publisher', title: t('book.properties.publisher') },
        { attr: 'status', title: t('book.properties.status') },
        { attr: 'boughtAt', title: t('book.properties.boughtAt') },
        { attr: 'readAt', title: t('book.properties.readAt') },
        { attr: 'paidPrice.value', title: t('book.properties.paidPrice') },
        { attr: 'labelPrice.value', title: t('book.properties.labelPrice') },
        { attr: 'createdAt', title: t('book.properties.createdAt') },
        { attr: 'updatedAt', title: t('book.properties.updatedAt') }
      ]

      return properties.sort((a, b) => a.title.localeCompare(b.title, locale.value))
    })

    function removeHistoryItem (item) {
      const newHistory = searchHistory.value.filter(s => s !== item)

      store.commit(MutationTypes.COLLECTION_UPDATE_SEARCH, {
        history: newHistory
      })
    }

    return {
      t,
      closeDialog,
      searchQuery,
      searchedOnce,
      searchedTerm,
      searchLoading,
      searchResults,
      searchHistory,
      searchInput,
      results,
      handleSubmit,
      clearSearch,
      search,
      debounce: createDebounce(),
      sortBy,
      sortDirection,
      toggleSortDirection,
      sortProperties,
      removeHistoryItem
    }
  }
}
</script>

<style scoped>
input[type="search"]::-webkit-search-decoration,
input[type="search"]::-webkit-search-cancel-button,
input[type="search"]::-webkit-search-results-button,
input[type="search"]::-webkit-search-results-decoration {
  display: none;
}
</style>
