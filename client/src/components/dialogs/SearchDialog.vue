<script lang="ts" setup>
import { useActiveElement, useDebounceFn } from '@vueuse/core'
import PaginatorUtil from 'paginator'

import { keepPreviousData, useQueryClient } from '@tanstack/vue-query'
import {
  BarsArrowDownIcon,
  BarsArrowUpIcon,
  XMarkIcon,
} from '@heroicons/vue/20/solid'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import { useI18n } from '@/i18n'
import { PER_PAGE } from '@/services/sheet/constants'
import { createSearchKeywords } from '@/services/sheet/searchBooks'

const props = defineProps<{ isOpen: boolean }>()

const emit = defineEmits<{ (e: 'close'): void }>()

const { t, locale } = useI18n({ useScope: 'global' })
const { isOpen } = toRefs(props)

const searchStore = useSearchStore()
const sheetStore = useSheetStore()

const searchInputValue = ref('')
const searchQuery = ref('')
const searchedOnce = ref(false)
const searchedTerm = ref('')
const searchHistory = computed(() => searchStore.history)
const searchPagination = computed(() => searchStore.pagination)

const handleInput = useDebounceFn(() => {
  searchQuery.value = searchInputValue.value
}, 1000)

const searchInput = ref<HTMLInputElement>()
const inputRenderer = ref<HTMLDivElement>()
const results = ref(null)
const dialogContent = ref(null)

const sortBy = computed({
  get: () => searchStore.sortBy,
  set: val => searchStore.updateSort({ sortBy: val }),
})

const sortDirection = computed({
  get: () => searchStore.sortDirection,
  set: val => searchStore.updateSort({ sortDirection: val }),
})

const searchEnabled = computed(() => {
  return isOpen.value && searchQuery.value.length > 0
})

const {
  isLoading: searchLoading,
  data: searchData,
  isFetching,
} = useBookSearchQuery({
  query: searchQuery,
  sortBy,
  sortDirection,
  page: computed(() => searchStore.page),
  enabled: searchEnabled,
  placeholderData: keepPreviousData,
})
const queryClient = useQueryClient()

const searchResults = computed(() => searchData.value?.results)
const resultsList = ref<HTMLUListElement>()
const historyList = ref<HTMLUListElement>()
const searchItemFocused = ref(0)
const historyItemFocused = ref(0)

type State = 'history' | 'results' | 'empty_results'
const state = ref<State>('history')

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
      searchStore.page,
    )

    searchStore.updatePagination(pagination)

    state.value = newData.total > 0 ? 'results' : 'empty_results'
  }
})

async function clearSearch(focusOnInput?: boolean) {
  queryClient.removeQueries({ queryKey: ['book-search'] })

  searchInputValue.value = ''
  searchQuery.value = ''
  searchedOnce.value = false
  searchedTerm.value = ''
  state.value = 'history'

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
  searchInputValue.value = query
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
    lastFocus.value?.classList.contains('history-item')
    || lastFocus.value?.classList.contains('pag-button')
  ) {
    setTimeout(() => {
      focusOnResults()
    }, 210)
  } else {
    lastFocus.value?.focus()
  }
})

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
    { attr: 'updatedAt', title: t('book.properties.updatedAt') },
  ]

  return properties.sort((a, b) => a.title.localeCompare(b.title, locale.value))
})

function removeHistoryItem(item: string) {
  const newHistory = searchHistory.value.filter(s => s !== item)

  searchStore.updateHistory(newHistory)
}

async function handlePageChange(page: number) {
  searchStore.updatePage(page)
}

const shared = computed(() => sheetStore.shared)
const owner = computed(() => ({
  displayName: sheetStore.ownerDisplayName,
  pictureUrl: sheetStore.ownerPictureUrl,
}))

function handleSearchItemKeydown(event: KeyboardEvent) {
  if (!resultsList.value || searchLoading.value) {
    return
  }

  const nextValue = handleItemKeydown(
    event,
    searchItemFocused.value,
    searchResults.value!.length,
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
      searchHistory.value.length,
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
  totalItems: number,
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
    !searchLoading.value
    && searchedTerm.value.length > 0
    && searchResults.value!.length > 0
  ) {
    focusOnElement(resultsList.value!, searchItemFocused.value)
  } else if (searchHistory.value.length > 0) {
    focusOnElement(historyList.value!, historyItemFocused.value)
  }
}

const searchKeywordsRegex = computed(() => {
  return new RegExp(
    `^-?(?:${Object.keys(createSearchKeywords()).join('|')})`,
  )
})

// https://github.com/nepsilon/search-query-parser/blob/master/lib/search-query-parser.js
const KEYWORDS_REGEX
  = /(\S+:'(?:[^'\\]|\\.)*'?)|(\S+:"(?:[^"\\]|\\.)*"?)|\S+:\S+/g
const KEYWORD_INCLUDE_TEMPLATE
  = '<span class="keyword keyword-included">$&</span>'
const KEYWORD_EXCLUDE_TEMPLATE
  = '<span class="keyword keyword-excluded">$&</span>'

const { escapeHtml } = useMarkdown()

function syncScroll(event: Event) {
  const target = event.target! as HTMLInputElement

  inputRenderer.value!.scrollTop = target.scrollTop
  inputRenderer.value!.scrollLeft = target.scrollLeft
}

const inputRendererHtml = computed(() => {
  return escapeHtml(searchInputValue.value)
    .replace(/&quot;/g, '"')
    .replace(KEYWORDS_REGEX, (string) => {
      const template
        = string.charAt(0) === '-'
          ? KEYWORD_EXCLUDE_TEMPLATE
          : KEYWORD_INCLUDE_TEMPLATE
      return string.match(searchKeywordsRegex.value)
        ? template.replace('$&', string)
        : string
    })
    .replace(/<\/span>(.*?)<span/g, '</span><span>$1</span><span')
})
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
                'border-b border-gray-300 dark:border-gray-600 relative overflow-y-hidden',
              ]"
              autocomplete="off"
              @submit.prevent="search(searchInput!!.value)"
            >
              <span aria-hidden="true" class="w-6 h-6 relative">
                <MagnifyingGlassIcon
                  class="absolute w-6 h-6 text-primary-600 dark:text-primary-400 bg-white dark:bg-gray-800"
                />
              </span>

              <div class="flex-1 search-input-wrapper">
                <label id="search-label" for="search-input" class="sr-only">
                  {{ t('dashboard.search.label') }}
                </label>

                <div class="relative">
                  <input
                    id="search-input"
                    ref="searchInput"
                    v-model="searchInputValue"
                    type="search"
                    class="search-input"
                    spellcheck="false"
                    autocorrect="off"
                    role="combobox"
                    aria-controls="search-options"
                    aria-labelledby="search-label"
                    :placeholder="t('dashboard.search.placeholder')"
                    :disabled="(searchLoading && searchEnabled) || !isOpen"
                    @input="handleInput"
                    @keyup.enter.prevent="
                      search(($event.target as HTMLInputElement).value)
                    "
                    @keyup.arrow-down.exact.prevent="focusOnResults"
                    @scroll="syncScroll"
                  >

                  <div
                    v-if="searchInputValue.length > 0"
                    ref="inputRenderer"
                    class="input-renderer"
                    v-html="inputRendererHtml"
                  />
                </div>
              </div>

              <FadeTransition>
                <button
                  v-if="!searchLoading && searchQuery.length > 0"
                  type="reset"
                  class="clear-button has-ring-focus dark:focus-visible:ring-offset-gray-800"
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
                v-if="shared"
                class="shrink-0"
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
                <kbd aria-hidden="true" class="font-sans-safe"> esc </kbd>
              </button>
            </form>

            <FadeTransition>
              <div
                v-if="state === 'results'"
                ref="results"
                tabindex="-1"
                class="results"
              >
                <div class="grow min-h-0 overflow-y-auto pt-5">
                  <div class="results-header">
                    <h3 id="results-header" class="title">
                      {{ t('dashboard.search.results') }}
                    </h3>

                    <div class="flex -space-x-px w-full sm:w-auto">
                      <div class="flex-1 sm:flex-initial sm:w-56">
                        <label for="search-sort-by" class="sr-only">
                          {{ t('dashboard.library.filters.sortBy') }}
                        </label>

                        <select
                          id="search-sort-by"
                          v-model="sortBy"
                          class="relative focus:z-10 select rounded-r-none w-full py-1.5 px-2.5"
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
                        v-slot="{ iconClass }"
                        :disabled="searchLoading"
                        size="small"
                        class="!px-2 !rounded-l-none !rounded-r-md"
                        icon-only
                        :title="
                          t(
                            sortDirection === 'asc'
                              ? 'dashboard.library.filters.sortDirection.asc'
                              : 'dashboard.library.filters.sortDirection.desc',
                          )
                        "
                        @click="toggleSortDirection"
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
                    id="search-options"
                    ref="resultsList"
                    class="divide-y divide-gray-200 dark:divide-gray-700 mt-3"
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
                          searchPagination?.total_results || 0,
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

              <div
                v-else-if="state === 'empty_results'"
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
                v-else-if="state === 'history' && searchHistory.length > 0"
                class="history"
              >
                <h3 id="history-header" class="title px-5">
                  {{ t('dashboard.search.history') }}
                </h3>

                <ul
                  id="search-options"
                  ref="historyList"
                  class="divide-y divide-gray-200 dark:divide-gray-700 border-t border-gray-200 dark:border-gray-700"
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
              :loading="(searchLoading && searchEnabled) || isFetching"
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

.search-input-wrapper {
  &::after {
    @apply content-[''] absolute inset-x-0 bottom-0
    bg-primary-600 dark:bg-primary-400 h-2px scale-x-0
    motion-safe:transition-transform motion-safe:ease-in motion-safe:delay-150;
  }

  &:focus-within::after {
    @apply scale-x-100 will-change-transform;
  }

  .search-input {
    @apply px-1 w-full border-0 p-0 font-medium text-base
      selection:bg-primary-200 dark:selection:bg-gray-600/80
      dark:bg-gray-800 dark:text-gray-100 accent-primary-600;

    &:focus {
      @apply ring-0;
    }

    &:disabled {
      @apply opacity-60;
    }

    &:not(:placeholder-shown) {
      -webkit-text-fill-color: transparent;
    }
  }

  .input-renderer {
    scrollbar-width: 0;
    @apply px-1 absolute inset-x-0 -inset-y-1 flex items-center whitespace-pre text-base
      font-medium overflow-x-auto select-none pointer-events-none;

    &::-webkit-scrollbar {
      display: none;
    }
  }
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
  @apply text-gray-700 dark:text-gray-200 font-semibold font-display-safe;
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

<style lang="postcss">
.keyword {
  @apply dark:h-6 rounded dark:rounded-none inline-block
    dark:box-border dark:border-dotted;

  &.keyword-included {
    @apply text-emerald-700 dark:text-emerald-400
      bg-emerald-200/40 dark:bg-transparent
      dark:border-b-2 dark:border-emerald-600/80
      ring-2 ring-emerald-200/40 dark:ring-0;
  }

  &.keyword-excluded {
    @apply text-red-700 dark:text-red-400
      bg-red-200/40 dark:bg-transparent
      dark:border-b-2 dark:border-red-400/50
      ring-2 ring-red-200/40 dark:ring-0;
  }
}
</style>
