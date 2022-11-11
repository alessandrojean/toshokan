<script lang="ts" setup>
import { computed, nextTick, ref, toRefs, watch } from 'vue'
import PaginatorUtil from 'paginator'
import { useActiveElement } from '@vueuse/core'

import { useI18n } from '@/i18n'
import { useSearchStore } from '@/stores/search'
import { useSheetStore } from '@/stores/sheet'
import { PER_PAGE } from '@/services/sheet/constants'
import useBookSearchQuery from '@/queries/useBookSearchQuery'

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot
} from '@headlessui/vue'

import {
  BarsArrowUpIcon,
  BarsArrowDownIcon,
  XMarkIcon
} from '@heroicons/vue/20/solid'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

import Avatar from '@/components/Avatar.vue'
import Button from '@/components/form/Button.vue'
import FadeTransition from '@/components/transitions/FadeTransition.vue'
import LoadingIndicator from '@/components/LoadingIndicator.vue'
import Paginator from '@/components/Paginator.vue'
import SearchHistoryItem from '@/components/SearchHistoryItem.vue'
import SearchItem from '@/components/SearchItem.vue'

const props = defineProps<{ isOpen: boolean }>()

const emit = defineEmits<{ (e: 'close'): void }>()

const { t, locale } = useI18n({ useScope: 'global' })
const { isOpen } = toRefs(props)

const searchStore = useSearchStore()
const sheetStore = useSheetStore()

const searchQuery = ref('')
const searchedOnce = ref(false)
const searchedTerm = ref('')
const searchHistory = computed(() => searchStore.history)
const searchPagination = computed(() => searchStore.pagination)

const searchInput = ref<HTMLInputElement>()
const results = ref(null)
const dialogContent = ref(null)

const sortBy = computed({
  get: () => searchStore.sortBy,
  set: (val) => searchStore.updateSort({ sortBy: val })
})

const sortDirection = computed({
  get: () => searchStore.sortDirection,
  set: (val) => searchStore.updateSort({ sortDirection: val })
})

const searchEnabled = computed(() => {
  return isOpen.value && searchQuery.value.length > 0
})

const {
  isLoading: searchLoading,
  data: searchData,
  isFetching,
  isPreviousData,
  remove
} = useBookSearchQuery(
  {
    query: searchQuery,
    sortBy,
    sortDirection,
    page: computed(() => searchStore.page)
  },
  { enabled: searchEnabled, keepPreviousData: true }
)

const searchResults = computed(() => searchData.value?.results)

watch(searchData, (newData) => {
  if (newData !== undefined) {
    searchItemFocused.value = 0
    historyItemFocused.value = 0

    if (searchQuery.value.length > 0) {
      const newHistory = [searchQuery.value].concat(searchHistory.value)

      searchStore.updateHistory(Array.from(new Set(newHistory)).slice(0, 6))
    }

    searchedTerm.value = searchQuery.value

    const pagination = new PaginatorUtil(PER_PAGE, 4).build(
      newData.total,
      searchStore.page
    )

    searchStore.updatePagination(pagination)
  }
})

async function clearSearch(focusOnInput?: boolean) {
  remove.value()

  searchQuery.value = ''
  searchedOnce.value = false
  searchedTerm.value = ''

  searchStore.clear()

  if (focusOnInput) {
    await nextTick()
    searchInput.value?.focus()
  }
}

function closeDialog() {
  emit('close')
}

function search(query: string) {
  searchQuery.value = query
  searchStore.updateQuery(query)
}

defineExpose({ search })

const lastFocus = ref<HTMLElement | null | undefined>(null)
const activeElement = useActiveElement()

watch(isFetching, async (newIsFetching) => {
  if (newIsFetching) {
    lastFocus.value = activeElement.value
    lastFocus.value?.blur()

    return
  }

  await nextTick()

  if (
    lastFocus.value?.classList.contains('history-item') ||
    lastFocus.value?.classList.contains('pag-button')
  ) {
    setTimeout(() => {
      focusOnResults()
    }, 210)
  } else {
    lastFocus.value?.focus()
  }
})

function createDebounce() {
  let timeout: ReturnType<typeof setTimeout>

  return function (fn: Function, delayMs?: number) {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      fn()
    }, delayMs ?? 1000)
  }
}

const debounce = createDebounce()

watch(searchQuery, async (newQuery, oldQuery) => {
  if (newQuery.length === 0 && oldQuery.length > 0) {
    clearSearch()
  }
})

function toggleSortDirection() {
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

function removeHistoryItem(item: string) {
  const newHistory = searchHistory.value.filter((s) => s !== item)

  searchStore.updateHistory(newHistory)
}

async function handlePageChange(page: number) {
  searchStore.updatePage(page)
}

const shared = computed(() => sheetStore.shared)
const owner = computed(() => ({
  displayName: sheetStore.ownerDisplayName,
  pictureUrl: sheetStore.ownerPictureUrl
}))

const resultsList = ref<HTMLUListElement>()
const historyList = ref<HTMLUListElement>()
const searchItemFocused = ref(0)
const historyItemFocused = ref(0)

function handleSearchItemKeydown(event: KeyboardEvent) {
  if (!resultsList.value || searchLoading.value) {
    return
  }

  const nextValue = handleItemKeydown(
    event,
    searchItemFocused.value,
    searchResults.value!.length
  )

  if (nextValue === null) {
    return
  }

  searchItemFocused.value = nextValue

  focusOnElement(resultsList.value, searchItemFocused.value)
}

function handleHistoryItemKeydown(event: KeyboardEvent) {
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
    focusOnElement(historyList.value!, historyItemFocused.value)
  })
}

function handleItemKeydown(
  event: KeyboardEvent,
  focused: number,
  totalItems: number
) {
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
    return focused - 1 < 0 ? totalItems - 1 : focused - 1
  } else if (key === 'Home') {
    return 0
  } else {
    return totalItems - 1
  }
}

function focusOnElement(container: Element, i: number) {
  const li = container?.children?.[i]
  const element = li?.children?.[0] as HTMLElement | undefined

  element?.focus()
}

function focusOnResults() {
  if (
    !searchLoading.value &&
    searchedTerm.value.length > 0 &&
    searchResults.value!.length > 0
  ) {
    focusOnElement(resultsList.value!, searchItemFocused.value)
  } else if (searchHistory.value.length > 0) {
    focusOnElement(historyList.value!, historyItemFocused.value)
  }
}
</script>

<template>
  <TransitionRoot
    appear
    :show="isOpen"
    as="template"
    @after-leave="clearSearch"
    @after-enter="searchInput?.focus()"
  >
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
          <div class="dialog-overlay" />
        </TransitionChild>

        <TransitionChild
          as="template"
          class="transform"
          enter="motion-reduce:transition-none duration-300 ease-out"
          enter-from="opacity-0 scale-95"
          enter-to="opacity-100 scale-100"
          leave="motion-reduce:transition-none duration-200 ease-in"
          leave-from="opacity-100 scale-100"
          leave-to="opacity-0 scale-95"
        >
          <DialogPanel ref="dialogContent" class="dialog-content">
            <DialogTitle as="h3" class="sr-only">
              {{ t('dashboard.search.label') }}
            </DialogTitle>

            <form
              :class="[
                'py-4 px-5 flex items-center space-x-3 md:space-x-4 shrink-0',
                'border-b border-gray-300 dark:border-gray-600 relative overflow-y-hidden'
              ]"
            >
              <span aria-hidden="true" class="w-6 h-6 relative">
                <MagnifyingGlassIcon
                  class="absolute w-6 h-6 text-primary-600 dark:text-primary-400 bg-white dark:bg-gray-800"
                />
              </span>

              <div class="flex-1 search-input-wrapper">
                <label for="search-input" id="search-label" class="sr-only">
                  {{ t('dashboard.search.label') }}
                </label>

                <input
                  type="search"
                  id="search-input"
                  ref="searchInput"
                  class="search-input"
                  spellcheck="false"
                  role="combobox"
                  aria-controls="search-options"
                  aria-labelledby="search-label"
                  :value="searchQuery"
                  :placeholder="t('dashboard.search.placeholder')"
                  :disabled="searchLoading || !isOpen"
                  @input="
                    debounce(() => {
                      searchQuery = ($event.target as HTMLInputElement).value
                    })
                  "
                  @keyup.enter.prevent="
                    search(($event.target as HTMLInputElement).value)
                  "
                  @keyup.arrow-down.exact.prevent="focusOnResults"
                />
              </div>

              <FadeTransition>
                <button
                  type="reset"
                  class="clear-button has-ring-focus dark:focus-visible:ring-offset-gray-800"
                  v-if="!searchLoading && searchQuery.length > 0"
                  @click="clearSearch(true)"
                >
                  <span aria-hidden="true">
                    <XMarkIcon class="w-5 h-5" />
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
                <kbd aria-hidden="true" class="font-sans"> esc </kbd>
              </button>
            </form>

            <FadeTransition>
              <div
                v-if="searchResults?.length === 0"
                class="no-results select-none"
              >
                <i18n-t
                  keypath="dashboard.search.noResultsFound"
                  tag="p"
                  scope="global"
                >
                  <span class="text-gray-900 dark:text-gray-100">{{
                    searchedTerm
                  }}</span>
                </i18n-t>
              </div>

              <div
                v-else-if="
                  (searchResults?.length ?? 0) > 0 && searchQuery.length > 0
                "
                tabindex="-1"
                ref="results"
                class="results"
              >
                <div class="grow min-h-0 overflow-y-auto pt-5">
                  <div class="results-header">
                    <h3 class="title" id="results-header">
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

                      <Button
                        :disabled="searchLoading"
                        size="small"
                        class="!px-2 !rounded-l-none !rounded-r-md"
                        icon-only
                        @click="toggleSortDirection"
                        :title="
                          t(
                            sortDirection === 'asc'
                              ? 'dashboard.library.filters.sortDirection.asc'
                              : 'dashboard.library.filters.sortDirection.desc'
                          )
                        "
                        v-slot="{ iconClass }"
                      >
                        <BarsArrowUpIcon
                          v-if="sortDirection === 'asc'"
                          :class="iconClass"
                        />
                        <BarsArrowDownIcon v-else :class="iconClass" />
                      </Button>
                    </div>
                  </div>

                  <ul
                    class="divide-y divide-gray-200 dark:divide-gray-700 mt-3"
                    ref="resultsList"
                    id="search-options"
                    aria-labelledby="results-header"
                    role="listbox"
                  >
                    <li
                      v-for="(result, resultIdx) in searchResults"
                      :key="result.id!"
                      role="option"
                      :aria-selected="
                        resultIdx === searchItemFocused && !searchLoading
                          ? true
                          : undefined
                      "
                    >
                      <SearchItem
                        :result="result"
                        :tabindex="
                          resultIdx === searchItemFocused && !searchLoading
                            ? '0'
                            : '-1'
                        "
                        @click="closeDialog"
                        @keydown="handleSearchItemKeydown"
                      />
                    </li>
                  </ul>
                </div>

                <FadeTransition>
                  <div
                    v-if="(searchResults?.length ?? 0) > 0"
                    class="search-footer"
                    :data-total-pages="searchPagination?.total_pages"
                  >
                    <p class="hidden sm:block">
                      {{
                        t(
                          'dashboard.search.resultCount',
                          searchPagination?.total_results || 0
                        )
                      }}
                    </p>

                    <Paginator
                      v-if="
                        searchPagination && searchPagination.total_pages > 1
                      "
                      :enabled="!searchLoading"
                      :pagination-info="searchPagination"
                      @page="handlePageChange"
                    />
                  </div>
                </FadeTransition>
              </div>

              <div v-else-if="searchHistory.length > 0" class="history">
                <h3 class="title px-5" id="history-header">
                  {{ t('dashboard.search.history') }}
                </h3>

                <ul
                  class="divide-y divide-gray-200 dark:divide-gray-700 border-t border-gray-200 dark:border-gray-700"
                  ref="historyList"
                  id="search-options"
                  aria-labelledby="history-header"
                  role="listbox"
                >
                  <li
                    v-for="(historyItem, historyIdx) in searchHistory"
                    :key="historyItem"
                    role="option"
                    :aria-selected="
                      historyIdx === historyItemFocused && !searchLoading
                        ? true
                        : undefined
                    "
                  >
                    <SearchHistoryItem
                      :class="
                        historyIdx === searchHistory.length - 1
                          ? 'focus-visible:rounded-b-2xl'
                          : ''
                      "
                      :tabindex="
                        historyIdx === historyItemFocused && !searchLoading
                          ? '0'
                          : '-1'
                      "
                      :search="historyItem"
                      @click="search($event)"
                      @click:remove="removeHistoryItem($event)"
                      @keydown="handleHistoryItemKeydown"
                    />
                  </li>
                </ul>
              </div>

              <div v-else class="no-history select-none">
                <p>{{ t('dashboard.search.noHistory') }}</p>
              </div>
            </FadeTransition>

            <LoadingIndicator
              :loading="searchLoading || (isFetching && isPreviousData)"
              :blur="false"
              z-index="z-50"
            />
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<style lang="postcss" scoped>
input[type='search']::-webkit-search-decoration,
input[type='search']::-webkit-search-cancel-button,
input[type='search']::-webkit-search-results-button,
input[type='search']::-webkit-search-results-decoration {
  display: none;
}

.dialog {
  @apply fixed z-30 inset-0 flex flex-col items-center
    py-4 px-4 sm:py-6 sm:px-6 md:px-0 md:py-12 lg:py-24;
}

.dialog-content {
  @apply flex flex-col w-full max-w-2xl
    overflow-hidden text-left
    bg-white dark:bg-gray-800
    shadow-xl rounded-2xl
    ring-1 ring-black/5;
}

.search-input-wrapper::after {
  @apply content-[''] absolute inset-x-0 bottom-0
    bg-primary-600 dark:bg-primary-400 h-2px scale-x-0
    motion-safe:transition-transform motion-safe:ease-in motion-safe:delay-150;
}

.search-input-wrapper:focus-within::after {
  @apply scale-x-100 will-change-transform;
}

.search-input {
  @apply w-full border-0 p-0 font-medium
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

.esc-button:where(:focus-visible, :hover) {
  @apply text-gray-600 dark:text-gray-100
    bg-gray-100 dark:bg-gray-700/80
    border-gray-400 dark:border-gray-400/70;
}

.results {
  @apply grow flex flex-col min-h-0;
}

.results-header {
  @apply px-5 flex flex-col sm:flex-row space-y-2 sm:space-y-0 shrink-0
    justify-between sm:items-center;
}

.title {
  @apply text-gray-700 dark:text-gray-200 font-semibold font-display;
}

.no-results,
.no-history {
  @apply py-10 mx-5 mb-2 md:mb-0
    md:text-lg text-gray-400 font-medium;
}

.history {
  @apply grow overflow-y-auto space-y-3.5 pt-6;
}

.search-footer {
  @apply shrink-0 border-t border-gray-300 dark:border-gray-600
    text-sm text-gray-600 dark:text-gray-400 font-medium
    py-4 px-5 flex justify-center sm:justify-between items-center;
}

.search-footer[data-total-pages='1'] {
  @apply hidden sm:flex;
}
</style>
