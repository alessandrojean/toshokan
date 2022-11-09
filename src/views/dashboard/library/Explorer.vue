<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, toRaw, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

import cloneDeep from 'lodash.clonedeep'

import useBulkDeleteBookMutation from '@/mutations/useBulkDeleteBookMutation'
import useBulkEditBookMutation from '@/mutations/useBulkEditBookMutation'
import { useCollectionStore } from '@/stores/collection'
import {
  useSettingsStore,
  type GridMode,
  type ViewMode
} from '@/stores/settings'
import { useSheetStore } from '@/stores/sheet'
import { STATUS_READ } from '@/model/Book'
import useBooksQuery from '@/queries/useBooksQuery'
import useGroupsQuery from '@/queries/useGroupsQuery'

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  FunnelIcon,
  PlusIcon
} from '@heroicons/vue/20/solid'
import {
  DocumentMagnifyingGlassIcon,
  ExclamationCircleIcon,
  TableCellsIcon,
  SquaresPlusIcon,
  Squares2X2Icon
} from '@heroicons/vue/24/outline'

import { RadioGroup, RadioGroupLabel, RadioGroupOption } from '@headlessui/vue'

import BookCreateDialog from '@/components/dialogs/BookCreateDialog.vue'
import BookDeleteDialog from '@/components/dialogs/BookDeleteDialog.vue'
import BookGrid from '@/components/book/BookGrid.vue'
import BookTable, {
  MarkAsEvent,
  SortEvent,
  ToggleFavoriteEvent
} from '@/components/book/BookTable.vue'
import Button from '@/components/form/Button.vue'
import FadeTransition from '@/components/transitions/FadeTransition.vue'
import LibraryFiltersDialog, {
  type FilterState
} from '@/components/dialogs/LibraryFiltersDialog.vue'
import LibraryHeader from '@/components/LibraryHeader.vue'
import Paginator from '@/components/Paginator.vue'

const { t } = useI18n({ useScope: 'global' })
const collectionStore = useCollectionStore()
const settingsStore = useSettingsStore()
const sheetStore = useSheetStore()

const filterOpen = ref(false)

const sheetIsEmpty = computed(() => sheetStore.isEmpty)

const currentPage = computed(() => collectionStore.currentPage)
const paginationInfo = computed(() => collectionStore.paginationInfo)
const sortProperty = computed(() => collectionStore.sortBy)
const sortDirection = computed(() => collectionStore.sortDirection)

const viewMode = computed({
  get() {
    if (settingsStore.viewMode === 'table') {
      return 'table'
    }

    return settingsStore.viewMode + ',' + settingsStore.gridMode
  },
  set(value) {
    const [viewMode, gridMode] = value.split(',')

    settingsStore.updateViewMode(viewMode as ViewMode)

    if (gridMode) {
      settingsStore.updateGridMode(gridMode as GridMode)
    }

    selection.value = []
  }
})

const sortPropertyNames = computed<Record<string, string>>(() => ({
  title: t('book.properties.title'),
  publisher: t('book.properties.publisher'),
  status: t('book.properties.status'),
  readAt: t('book.properties.readAt'),
  'paidPrice.value': t('book.properties.paidPrice'),
  'labelPrice.value': t('book.properties.labelPrice'),
  createdAt: t('book.properties.createdAt'),
  updatedAt: t('book.properties.updatedAt')
}))

const route = useRoute()
const sheetId = computed(() => sheetStore.sheetId)
const sheetLoading = computed(() => sheetStore.loading)
const sheetLoadedOnce = computed(() => sheetStore.loadedOnce)
const groupsFilter = computed(() => collectionStore.filters.groups)

const {
  mutate: bulkDeleteBooks,
  isLoading: deleting,
  isIdle: deletingIdle
} = useBulkDeleteBookMutation()

const {
  mutate: bulkUpdateBooks,
  isLoading: updating,
  isIdle: updatingIdle
} = useBulkEditBookMutation()

const queriesEnabled = computed(() => {
  return (
    !sheetLoading.value &&
    sheetId.value !== null &&
    deletingIdle.value &&
    updatingIdle.value
  )
})

const {
  data: groupsData,
  isIdle: groupsIdle,
  isLoading: groupsLoading
} = useGroupsQuery({ enabled: queriesEnabled })

const {
  data: booksData,
  isFetching: booksFetching,
  isIdle: booksIdle,
  isLoading: booksLoading,
  isStale: booksStale
} = useBooksQuery(
  {
    favorites: computed(() => collectionStore.favorites),
    futureItems: computed(() => collectionStore.futureItems),
    groups: groupsFilter,
    page: currentPage,
    sortBy: sortProperty,
    sortDirection
  },
  { enabled: queriesEnabled }
)

const books = computed(() => booksData.value?.books || [])

const loading = computed(() => {
  return (
    booksLoading.value ||
    groupsLoading.value ||
    groupsIdle.value ||
    booksIdle.value
  )
})

watch(groupsData, (newGroups) => {
  if (!newGroups) {
    return
  }

  // Remove the inexistent groups from selection.
  const fixedGroups = collectionStore.filters.groups.filter(
    (selGroup) =>
      groupsData.value!.find((grp) => grp.name === selGroup) !== undefined
  )

  collectionStore.updateGroups(fixedGroups)
})

watch(
  () => booksData.value?.totalResults,
  (newTotals) => {
    collectionStore.updateCurrentPage({
      page: currentPage.value,
      totalResults: newTotals
    })
  }
)

function updateGroupFromQuery() {
  const newGroup = route.query.group ? String(route.query.group) : null

  if (sheetLoading.value || loading.value) {
    return false
  }

  if (!newGroup) {
    const allGroups = (groupsData.value ?? []).map((group) => group.name)
    collectionStore.updateGroups(allGroups)

    return true
  }

  const groupExists = groupsData.value?.find((grp) => grp.name === newGroup)

  if (groupExists) {
    collectionStore.updateGroups([newGroup])

    return true
  }

  return false
}

function updateSortPropertyFromQuery() {
  const newSortProperty = route.query.sortProperty as string

  if (sheetLoading.value || !newSortProperty) {
    return false
  }

  if (!sortPropertyNames.value[newSortProperty]) {
    return false
  }

  if (newSortProperty !== sortProperty.value) {
    collectionStore.updateSort({
      sortBy: newSortProperty,
      sortDirection: 'desc'
    })

    return true
  }

  return false
}

function updateFromQuery() {
  const groupChanged = updateGroupFromQuery()
  const sortChanged = updateSortPropertyFromQuery()

  if (groupChanged || sortChanged || books.value.length === 0) {
    collectionStore.$patch({
      currentPage: sortChanged ? 1 : currentPage.value
    })
  }
}

watch([sheetLoading, groupsData, () => route.query], () => {
  updateFromQuery()
})

onMounted(() => {
  if (sheetId.value) {
    updateFromQuery()
  }
})

const table = ref<InstanceType<typeof BookTable>>()
const grid = ref<InstanceType<typeof BookGrid>>()
const currentView = computed(() => {
  return viewMode.value === 'table' ? table.value : grid.value
})

type FocusableElement = Element & {
  blur: () => void
  focus: () => void
}

const lastFocus = ref<FocusableElement>()

watch(booksFetching, (value) => {
  if (value) {
    lastFocus.value = document.activeElement as FocusableElement
    lastFocus.value?.blur()
  }
})

async function handleFocus() {
  await nextTick()

  const classList = lastFocus.value?.classList

  if (classList?.contains('table-header-button')) {
    table.value?.focusOnActiveHeader()
  } else if (classList?.contains('pag-button')) {
    currentView.value?.focus()
  }
}

watch(collectionStore.$state, handleFocus)
watch(booksLoading, async (newValue) => {
  if (newValue) {
    await handleFocus()
  }
})

async function handlePage(page: number) {
  window.scroll({
    top: 0,
    left: 0,
    behavior: 'smooth'
  })

  const totalResults = collectionStore.paginationInfo.total_results
  collectionStore.updateCurrentPage({ page, totalResults })
}

async function handleFilter(filters: FilterState) {
  selection.value = []

  if (
    collectionStore.filters.groups !== filters.groups ||
    collectionStore.sortBy !== filters.sortProperty ||
    collectionStore.sortDirection !== filters.sortDirection ||
    collectionStore.favorites !== filters.favorites ||
    collectionStore.futureItems !== filters.futureItems
  ) {
    const totalResults = collectionStore.paginationInfo.total_results
    collectionStore.updateCurrentPage({
      page: 1,
      totalResults
    })

    collectionStore.updateGroups(filters.groups)
    collectionStore.updateSort({
      sortBy: filters.sortProperty,
      sortDirection: filters.sortDirection
    })
    collectionStore.updateFavorites(filters.favorites)
    collectionStore.updateFutureItems(filters.futureItems)
  }
}

async function handleTableSort({ property, direction }: SortEvent) {
  const totalResults = collectionStore.paginationInfo.total_results
  collectionStore.updateCurrentPage({
    page: 1,
    totalResults
  })

  collectionStore.updateSort({
    sortBy: property,
    sortDirection: direction
  })
}

const createDialogOpen = ref(false)

function openCreateDialog() {
  createDialogOpen.value = true
}

function closeCreateDialog() {
  createDialogOpen.value = false
}

const canEdit = computed(() => sheetStore.canEdit)

const selection = ref([] as number[])
const booksToDelete = computed(() => {
  return selection.value.map((idx) => books.value[idx])
})

const deleteDialogOpen = ref(false)

function handleDeleteSelection() {
  bulkDeleteBooks(booksToDelete.value)
}

function handleBulkMarkAs({ booksToEdit, newStatus }: MarkAsEvent) {
  const editedBooks = booksToEdit
    .filter((book) => book.status !== newStatus)
    .map((book) => {
      const clone = cloneDeep(toRaw(book))
      clone.status = newStatus
      clone.readAt = newStatus === STATUS_READ ? new Date() : null
      return clone
    })

  bulkUpdateBooks(editedBooks)
}

function handleBulkToggleFavorite({
  booksToEdit,
  newFavorite
}: ToggleFavoriteEvent) {
  const editedBooks = booksToEdit
    .filter((book) => book.favorite !== newFavorite)
    .map((book) => {
      const clone = cloneDeep(toRaw(book))
      clone.favorite = newFavorite
      return clone
    })

  bulkUpdateBooks(editedBooks)
}

const writing = computed(() => deleting.value || updating.value)
const gridMode = computed(() => settingsStore.gridMode)
const blurNsfw = computed(() => settingsStore.blurNsfw)
const spoilerMode = computed(() => settingsStore.spoilerMode)
</script>

<template>
  <div class="flex flex-col">
    <LibraryHeader
      :loading="loading"
      :writing="writing"
      @click:new="openCreateDialog"
      @click:filter="filterOpen = true"
    />

    <div class="flex-1">
      <FadeTransition>
        <section
          class="h-full max-w-7xl mx-auto pt-4 sm:pt-6 px-4 sm:px-6 space-y-4 sm:space-y-6 !mb-6"
          aria-labelledby="results-title"
          v-if="
            (sheetLoading || loading || writing || books.length > 0) &&
            !sheetIsEmpty
          "
        >
          <h2
            id="results-title"
            class="sr-only"
            hidden
            aria-live="polite"
            aria-hidden="true"
          >
            {{
              // @ts-ignore
              t('dashboard.library.items.current', groupsFilter.length, {
                count:
                  groupsFilter.length === 1
                    ? groupsFilter[0]
                    : groupsFilter.length
              })
            }}
          </h2>

          <div
            class="bg-white dark:bg-gray-800 px-4 py-4 md:py-3 sm:px-6 -mx-4 sm:-mx-6 md:mx-0 shadow md:rounded-xl flex flex-row justify-between items-center"
          >
            <div
              v-if="
                (sheetLoading && !writing) || (loading && books.length === 0)
              "
              class="skeleton h-5 w-40 md:w-48"
            />
            <div v-else>
              <i18n-t
                keypath="pagination.text"
                tag="p"
                class="text-xs sm:text-sm text-gray-700 dark:text-gray-300"
                scope="global"
              >
                <span class="font-semibold dark:text-gray-100">
                  {{ paginationInfo.current_page || 1 }}
                </span>
                <span class="font-semibold dark:text-gray-100">
                  {{ paginationInfo.total_pages || 1 }}
                </span>
                <span class="font-semibold dark:text-gray-100">
                  {{ paginationInfo.total_results || 0 }}
                </span>
              </i18n-t>
            </div>

            <div class="-mr-2 -my-1">
              <RadioGroup v-model="viewMode" :disabled="loading || writing">
                <RadioGroupLabel class="sr-only">
                  {{ t('dashboard.library.filters.viewMode.label') }}
                </RadioGroupLabel>
                <div class="flex space-x-0.5">
                  <RadioGroupOption
                    value="table"
                    class="view-button has-ring-focus"
                    :title="t('dashboard.library.filters.viewMode.table')"
                  >
                    <span class="sr-only">
                      {{ t('dashboard.library.filters.viewMode.table') }}
                    </span>
                    <span aria-hidden="true">
                      <TableCellsIcon class="h-5 w-5" />
                    </span>
                  </RadioGroupOption>
                  <RadioGroupOption
                    value="grid,comfortable"
                    class="view-button has-ring-focus"
                    :title="
                      t('dashboard.library.filters.gridMode.comfortableGrid')
                    "
                  >
                    <span class="sr-only">
                      {{
                        t('dashboard.library.filters.gridMode.comfortableGrid')
                      }}
                    </span>
                    <span aria-hidden="true">
                      <Squares2X2Icon class="h-5 w-5" />
                    </span>
                  </RadioGroupOption>
                  <RadioGroupOption
                    value="grid,compact"
                    class="view-button has-ring-focus"
                    :title="t('dashboard.library.filters.gridMode.compactGrid')"
                  >
                    <span class="sr-only">
                      {{ t('dashboard.library.filters.gridMode.compactGrid') }}
                    </span>
                    <span aria-hidden="true">
                      <SquaresPlusIcon class="h-5 w-5" />
                    </span>
                  </RadioGroupOption>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div>
            <FadeTransition>
              <BookTable
                v-if="viewMode === 'table'"
                ref="table"
                :items="books"
                :sort-direction="sortDirection"
                :sort-property="sortProperty"
                :current-page="currentPage"
                :loading="loading || writing"
                :selectable="canEdit"
                :skeleton="sheetLoading || loading || writing"
                @click:delete-selection="deleteDialogOpen = true"
                @click:mark-as="handleBulkMarkAs"
                @click:toggle-favorite="handleBulkToggleFavorite"
                @select="selection = $event"
                @sort="handleTableSort"
              />

              <BookGrid
                v-else
                ref="grid"
                :items="books"
                :sort-direction="sortDirection"
                :sort-property="sortProperty"
                :current-page="currentPage"
                :loading="loading || writing"
                :skeleton-items="18"
                :mode="gridMode"
                :blur-nsfw="blurNsfw"
                :spoiler-mode="spoilerMode"
              />
            </FadeTransition>
          </div>

          <div
            v-if="paginationInfo.total_pages > 1"
            class="bg-white dark:bg-gray-800 px-4 py-4 md:py-3 sm:px-6 shadow md:rounded-xl flex -mx-4 sm:-mx-6 md:mx-0 flex-col md:flex-row md:justify-between items-center"
          >
            <div
              v-if="
                (sheetLoading && !writing) || (loading && books.length === 0)
              "
              class="skeleton h-5 w-40 md:w-48"
            />
            <div v-else>
              <i18n-t
                keypath="pagination.text"
                tag="p"
                class="text-sm text-gray-700 dark:text-gray-300 mb-4 md:mb-0"
                scope="global"
              >
                <span class="font-semibold dark:text-gray-100">
                  {{ paginationInfo.current_page }}
                </span>
                <span class="font-semibold dark:text-gray-100">
                  {{ paginationInfo.total_pages }}
                </span>
                <span class="font-semibold dark:text-gray-100">
                  {{ paginationInfo.total_results }}
                </span>
              </i18n-t>
            </div>

            <nav
              role="navigation"
              aria-label="Paginação do conteúdo"
              class="w-full sm:hidden"
            >
              <ul class="flex justify-center space-x-4">
                <li>
                  <div
                    v-if="
                      (sheetLoading && !writing) ||
                      (loading && books.length === 0)
                    "
                    class="skeleton h-9 w-28"
                  />
                  <Button
                    v-else
                    :disabled="
                      !paginationInfo.has_previous_page || loading || writing
                    "
                    @click.stop="handlePage(paginationInfo.current_page - 1)"
                  >
                    <template #left="{ iconClass }">
                      <ChevronLeftIcon :class="iconClass" />
                    </template>
                    <span>{{ t('pagination.previous') }}</span>
                  </Button>
                </li>

                <li>
                  <div
                    v-if="
                      (sheetLoading && !writing) ||
                      (loading && books.length === 0)
                    "
                    class="skeleton h-9 w-28"
                  />
                  <Button
                    v-else
                    :disabled="
                      !paginationInfo.has_next_page || loading || writing
                    "
                    @click.stop="handlePage(paginationInfo.current_page + 1)"
                  >
                    <span>{{ t('pagination.next') }}</span>
                    <template #right="{ iconClass }">
                      <ChevronRightIcon :class="iconClass" />
                    </template>
                  </Button>
                </li>
              </ul>
            </nav>

            <div
              v-if="
                (sheetLoading && !writing) || (loading && books.length === 0)
              "
              class="skeleton h-10 w-60 hidden sm:block"
            />
            <div v-else class="hidden sm:block">
              <Paginator
                v-if="paginationInfo.total_pages > 1"
                :pagination-info="paginationInfo"
                :enabled="!loading && !writing"
                @page="handlePage"
              />
            </div>
          </div>
        </section>

        <section
          v-else-if="sheetIsEmpty"
          aria-labelledby="empty-sheet-title"
          class="w-full max-w-lg mx-auto h-full flex items-center justify-center flex-col px-4"
        >
          <span aria-hidden="true">
            <ExclamationCircleIcon
              class="h-16 w-16 mb-8 text-gray-400 dark:text-gray-600"
            />
          </span>
          <h2
            id="empty-sheet-title"
            class="text-xl text-center font-medium text-gray-600 dark:text-gray-400 mb-2"
          >
            {{ t('dashboard.library.empty.title') }}
          </h2>
          <p class="text-center text-gray-600 dark:text-gray-400 mb-8">
            {{ t('dashboard.library.empty.description') }}
          </p>
          <Button
            v-if="canEdit"
            kind="primary"
            size="large"
            @click="openCreateDialog"
          >
            <template #left="{ iconClass }">
              <PlusIcon :class="iconClass" />
            </template>
            <span>{{ t('dashboard.library.newBook') }}</span>
          </Button>
        </section>

        <section
          v-else-if="books.length === 0"
          aria-labelledby="empty-sheet-title"
          class="w-full max-w-lg mx-auto h-full flex items-center justify-center flex-col px-4"
        >
          <span aria-hidden="true">
            <DocumentMagnifyingGlassIcon
              class="h-16 w-16 mb-8 text-gray-400 dark:text-gray-600"
            />
          </span>
          <h2
            id="empty-sheet-title"
            class="text-xl text-center font-medium text-gray-600 dark:text-gray-400 mb-2"
          >
            {{ t('dashboard.library.noResults.title') }}
          </h2>
          <p class="text-center text-gray-600 dark:text-gray-400 mb-8">
            {{ t('dashboard.library.noResults.description') }}
          </p>
          <Button size="large" @click="filterOpen = true">
            <template #left="{ iconClass }">
              <FunnelIcon :class="iconClass" />
            </template>
            <span>{{ t('dashboard.library.filter') }}</span>
          </Button>
        </section>
      </FadeTransition>
    </div>

    <!-- Filters -->
    <LibraryFiltersDialog
      v-model:open="filterOpen"
      v-if="!sheetIsEmpty"
      @filter="handleFilter"
    />

    <BookCreateDialog
      v-if="canEdit"
      :is-open="createDialogOpen"
      @close="closeCreateDialog"
    />

    <BookDeleteDialog
      v-if="canEdit"
      v-model:open="deleteDialogOpen"
      :quantity="selection.length"
      @click:delete="handleDeleteSelection"
    />
  </div>
</template>

<style lang="postcss" scoped>
.view-button {
  @apply p-2 rounded-md
    text-gray-500 dark:text-gray-400
    motion-safe:transition cursor-pointer;
}

.view-button:not([aria-disabled='true']):hover {
  @apply bg-gray-700/10 dark:bg-gray-200/10;
}

.view-button:not([aria-disabled='true']):hover:not([aria-checked='true']) {
  @apply text-gray-600 dark:text-gray-300;
}

.view-button:focus {
  @apply outline-none;
}

.view-button[aria-checked='true'] {
  @apply text-primary-600 dark:text-gray-300
    bg-primary-50 dark:bg-gray-600/50;
}

.view-button[aria-checked='true']:not([aria-disabled='true']):hover {
  @apply bg-primary-100 dark:bg-gray-500/60;
}

.view-button[aria-disabled='true'] {
  @apply opacity-50 cursor-default;
}
</style>
