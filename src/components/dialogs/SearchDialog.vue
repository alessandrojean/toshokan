<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="template" @close="closeDialog">
      <div class="dialog">
        <TransitionChild
          as="template"
          enter="motion-reduce:transition-none duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="motion-reduce:transition-none duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <DialogOverlay class="dialog-overlay" />
        </TransitionChild>

        <TransitionChild
          as="div"
          ref="dialogContent"
          class="dialog-content transform"
          enter="motion-reduce:transition-none duration-300 ease-out"
          enter-from="opacity-0 scale-95"
          enter-to="opacity-100 scale-100"
          leave="motion-reduce:transition-none duration-200 ease-in"
          leave-from="opacity-100 scale-100"
          leave-to="opacity-0 scale-95"
        >
          <DialogTitle as="h3" class="sr-only">
            {{ t('dashboard.search.label') }}
          </DialogTitle>

          <form
            :class="[
              'py-4 px-5 flex items-center space-x-3 md:space-x-4 shrink-0',
              'border-b border-gray-300 dark:border-gray-600'
            ]"
            @submit.prevent="handleSearch"
          >
            <span aria-hidden="true" class="w-6 h-6 relative">
              <SearchIcon class="absolute w-6 h-6 text-primary-600 dark:text-primary-400 bg-white dark:bg-gray-800" />
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
                class="search-input"
                :placeholder="t('dashboard.search.placeholder')"
                :disabled="searchLoading"
                @keyup.enter.prevent="search($event.target.value)"
                @keyup.arrow-down.exact.prevent="focusOnResults"
              >
            </div>

            <FadeTransition>
              <button
                type="reset"
                class="clear-button has-ring-focus dark:focus-visible:ring-offset-gray-800"
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
            </FadeTransition>

            <Avatar
              class="shrink-0"
              v-if="shared"
              :picture-url="owner.pictureUrl"
              :shared="shared"
              small
            />

            <button
              type="button"
              class="esc-button has-ring-focus dark:focus-visible:ring-offset-gray-800"
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

          <FadeTransition>
            <div
              v-if="searchedOnce && searchResults.length === 0"
              class="no-results"
            >
              <i18n-t keypath="dashboard.search.noResultsFound" tag="p" scope="global">
                <span class="text-gray-900 dark:text-gray-100">{{ searchedTerm }}</span>
              </i18n-t>
            </div>

            <div
              v-else-if="searchResults.length > 0"
              tabindex="-1"
              ref="results"
              class="results"
            >
              <div class="results-header">
                <h3 class="title">
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
                      :disabled="searchLoading"
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
                    class="button direction-button is-icon-only"
                    :disabled="searchLoading"
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

              <ul
                class="divide-y divide-gray-200 dark:divide-gray-700"
                ref="resultsList"
              >
                <li
                  v-for="(result, resultIdx) in searchResults"
                  :key="result.id"
                >
                  <SearchItem
                    :result="result"
                    :tabindex="resultIdx === searchItemFocused && !searchLoading ? '0' : '-1'"
                    @click="closeDialog"
                    @keydown="handleSearchItemKeydown"
                  />
                </li>
              </ul>
            </div>

            <div
              v-else-if="searchHistory.length > 0"
              class="history"
            >
              <h3 class="title px-5">
                {{ t('dashboard.search.history') }}
              </h3>

              <ul
                class="divide-y divide-gray-200 dark:divide-gray-700 border-y border-gray-200 dark:border-gray-700"
                ref="historyList"
              >
                <li
                  v-for="(historyItem, historyIdx) in searchHistory"
                  :key="historyItem"
                >
                  <SearchHistoryItem
                    :tabindex="historyIdx === historyItemFocused && !searchLoading ? '0' : '-1'"
                    :search="historyItem"
                    @click="search($event)"
                    @click:remove="removeHistoryItem($event)"
                    @keydown="handleHistoryItemKeydown"
                  />
                </li>
              </ul>
            </div>

            <div v-else class="no-history">
              <p>{{ t('dashboard.search.noHistory') }}</p>
            </div>
          </FadeTransition>

          <FadeTransition>
            <div
              v-if="searchResults.length > 0"
              class="search-footer"
            >
              <p class="hidden sm:block">
                {{ t('dashboard.search.resultCount', searchPagination?.total_results || 0) }}
              </p>

              <Paginator
                v-if="searchPagination && searchPagination.total_pages > 1"
                :enabled="!searchLoading"
                :pagination-info="searchPagination"
                @page="handlePageChange"
              />
            </div>
          </FadeTransition>

          <LoadingIndicator
            :loading="searchLoading"
            :blur="false"
            z-index="z-50"
          />
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script>
import { computed, nextTick, ref, toRefs, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { useSearchStore } from '@/stores/search'
import { useSheetStore } from '@/stores/sheet'

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

import Avatar from '@/components/Avatar.vue'
import FadeTransition from '@/components/transitions/FadeTransition.vue'
import LoadingIndicator from '@/components/LoadingIndicator.vue'
import Paginator from '@/components/Paginator.vue'
import SearchHistoryItem from '@/components/SearchHistoryItem.vue'
import SearchItem from '@/components/SearchItem.vue'

export default {
  components: {
    Avatar,
    Dialog,
    DialogOverlay,
    DialogTitle,
    FadeTransition,
    LoadingIndicator,
    Paginator,
    SearchHistoryItem,
    SearchIcon,
    SearchItem,
    SortAscendingIcon,
    SortDescendingIcon,
    TransitionChild,
    TransitionRoot,
    XIcon
  },

  props: {
    isOpen: Boolean
  },

  emits: ['close'],

  setup (props, context) {
    const { t, locale } = useI18n({ useScope: 'global' })

    const searchStore = useSearchStore()
    const sheetStore = useSheetStore()

    const loading = computed(() => sheetStore.loading)

    const searchQuery = ref('')
    const searchedOnce = ref(false)
    const searchedTerm = ref('')
    const searchLoading = computed(() => searchStore.loading)
    const searchResults = computed(() => searchStore.results)
    const searchHistory = computed(() => searchStore.history)
    const searchPagination = computed(() => searchStore.pagination)

    const searchInput = ref(null)
    const results = ref(null)
    const dialogContent = ref(null)

    function clearSearch (focusOnInput) {
      searchQuery.value = ''
      searchedOnce.value = false
      searchedTerm.value = ''

      searchStore.clear()

      if (focusOnInput) {
        searchInput.value?.focus()
      }
    }

    function closeDialog () {
      context.emit('close')

      setTimeout(() => clearSearch(), 300)
    }

    async function search (query, page = 1) {
      const searchTerm = query || searchQuery.value
      searchQuery.value = searchTerm

      const focusedElement = document.activeElement

      if (!loading.value && !searchLoading.value && searchTerm.length > 0) {
        focusedElement?.blur()
        searchItemFocused.value = 0
        historyItemFocused.value = 0

        await searchStore.search({ query: searchTerm, page })

        searchQuery.value = searchTerm
        searchedOnce.value = true
        searchedTerm.value = searchTerm

        nextTick(() => {
          if (
            focusedElement?.classList.contains('history-item') ||
            focusedElement?.classList.contains('pag-button')
          ) {
            setTimeout(() => {
              focusOnElement(resultsList.value, searchItemFocused.value)
            }, 210)
          } else {
            focusedElement?.focus()
          }
        })
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
      get: () => searchStore.sortBy,
      set: async val => {
        searchStore.updateSort({ sortBy: val })
        await search()
      }
    })

    const sortDirection = computed({
      get: () => searchStore.sortDirection,
      set: async val => {
        searchStore.updateSort({ sortDirection: val })
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

      searchStore.updateHistory(newHistory)
    }

    async function handlePageChange (page) {
      await search(null, page)
    }

    const shared = computed(() => sheetStore.shared)
    const owner = computed(() => ({
      displayName: sheetStore.ownerDisplayName,
      pictureUrl: sheetStore.ownerPictureUrl
    }))

    const resultsList = ref(null)
    const historyList = ref(null)
    const searchItemFocused = ref(0)
    const historyItemFocused = ref(0)

    /**
     * @param {KeyboardEvent} event
     */
    function handleSearchItemKeydown (event) {
      if (!resultsList.value || searchLoading.value) {
        return
      }

      const nextValue = handleItemKeydown(
        event,
        searchItemFocused.value,
        searchResults.value.length
      )

      if (nextValue === null) {
        return
      }

      searchItemFocused.value = nextValue

      focusOnElement(resultsList.value, searchItemFocused.value)
    }

    /**
     * @param {KeyboardEvent} event
     */
    function handleHistoryItemKeydown (event) {
      if (!historyList.value || searchLoading.value) {
        return
      }

      if (event.key === 'Delete') {
        removeHistoryItem(searchHistory.value[historyItemFocused.value])

        if (searchHistory.value.length === 0) {
          historyItemFocused.value = 0
        } else if (historyItemFocused.value > searchHistory.value.length - 1) {
          historyItemFocused.value--
        }
      } else {
        const nextValue = handleItemKeydown(
          event,
          historyItemFocused.value,
          searchHistory.value.length
        )

        if (nextValue === null) {
          return
        }

        historyItemFocused.value = nextValue
      }

      nextTick(() => {
        focusOnElement(historyList.value, historyItemFocused.value)
      })
    }

    /**
     * @param {KeyboardEvent} event
     */
    function handleItemKeydown (event, focused, totalItems) {
      const allowedKeys = ['ArrowUp', 'ArrowDown', 'Home', 'End']
      const { key } = event

      if (!allowedKeys.includes(key)) {
        return null
      }

      if (key === 'Home' && focused === 0) {
        return null
      }

      if (key === 'End' && focused === totalItems - 1) {
        return null
      }

      event.preventDefault()

      if (key === 'ArrowDown') {
        return (focused + 1) % totalItems
      } else if (key === 'ArrowUp') {
        return focused - 1 < 0
          ? totalItems - 1
          : focused - 1
      } else if (key === 'Home') {
        return 0
      } else {
        return totalItems - 1
      }
    }

    function focusOnElement (container, i) {
      const li = container?.children?.[i]
      const element = li?.children?.[0]

      element?.focus()
    }

    function focusOnResults () {
      if (!searchLoading.value && searchResults.value.length > 0) {
        focusOnElement(resultsList.value, searchItemFocused.value)
      } else if (searchHistory.value.length > 0) {
        focusOnElement(historyList.value, historyItemFocused.value)
      }
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
      searchPagination,
      searchInput,
      dialogContent,
      results,
      handleSubmit,
      clearSearch,
      search,
      debounce: createDebounce(),
      sortBy,
      sortDirection,
      toggleSortDirection,
      sortProperties,
      removeHistoryItem,
      handlePageChange,
      shared,
      owner,
      resultsList,
      historyList,
      searchItemFocused,
      historyItemFocused,
      handleItemKeydown,
      handleSearchItemKeydown,
      handleHistoryItemKeydown,
      focusOnResults
    }
  }
}
</script>

<style lang="postcss" scoped>
input[type="search"]::-webkit-search-decoration,
input[type="search"]::-webkit-search-cancel-button,
input[type="search"]::-webkit-search-results-button,
input[type="search"]::-webkit-search-results-decoration {
  display: none;
}

.dialog {
  @apply fixed z-20 inset-0 flex flex-col items-center
    py-4 px-4 sm:py-6 sm:px-6 md:px-0 md:py-12 lg:py-24;
}

.dialog-content {
  @apply flex flex-col w-full max-w-2xl
    overflow-hidden text-left
    bg-white dark:bg-gray-800
    shadow-xl rounded-2xl;
}

.search-input {
  @apply w-full border-0 p-0 font-medium
    placeholder-gray-400 dark:placeholder-gray-500
    dark:bg-gray-800 dark:text-gray-100;
}

.search-input:focus {
  @apply ring-0;
}

.search-input:disabled {
  @apply opacity-60;
}

.clear-button {
  @apply rounded-full text-gray-500 dark:text-gray-400
    motion-safe:transition-shadow;
}

.clear-button:hover,
.clear-button:focus-visible {
  @apply text-gray-800 dark:text-gray-200;
}

.clear-button:focus,
.esc-button:focus,
.results:focus,
.history:focus {
  @apply outline-none;
}

.esc-button {
  @apply hidden md:flex rounded-md
    border border-gray-300 dark:border-gray-600
    bg-gray-50 dark:bg-gray-800
    text-gray-400 dark:text-gray-300
    text-sm px-1.5 py-0.5 motion-safe:transition-shadow;
}

.results {
  @apply grow overflow-y-auto pt-5 space-y-3.5;
}

.results-header {
  @apply px-5 flex flex-col sm:flex-row space-y-2 sm:space-y-0
    justify-between sm:items-center;
}

.title {
  @apply text-gray-700 dark:text-gray-200 font-semibold font-display;
}

.direction-button {
  @apply relative px-2 py-1.5 rounded-l-none
    bg-gray-50 dark:bg-gray-800
    dark:border-gray-600;
}

.direction-button:hover {
  @apply bg-gray-100 dark:bg-gray-700;
}

.direction-button:active {
  @apply dark:bg-gray-600 dark:border-gray-600;
}

.direction-button:focus {
  @apply z-10;
}

.direction-button:focus-visible {
  @apply ring ring-offset-0
    border-primary-500 dark:border-primary-500
    ring-opacity-30 dark:ring-opacity-50;
}

.no-results,
.no-history {
  @apply py-10 mx-5 mb-2 md:mb-0
    md:text-lg text-gray-400 font-medium;
}

.history {
  @apply grow overflow-y-auto space-y-3.5 pt-6 pb-5;
}

.search-footer {
  @apply shrink-0 border-t border-gray-300 dark:border-gray-600
    text-sm text-gray-600 dark:text-gray-400 font-medium
    py-4 px-5 flex justify-center sm:justify-between items-center;
}
</style>
