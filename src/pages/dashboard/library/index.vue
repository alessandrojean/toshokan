<script lang="ts" setup>
import { reactiveComputed, useActiveElement } from '@vueuse/core'
import cloneDeep from 'lodash.clonedeep'
import { z as zod } from 'zod'
import { default as PaginatorUtil } from 'paginator'

import type { GridMode, ViewMode } from '@/stores/settings'
import { STATUS_READ } from '@/model/Book'
import { TriState } from '@/types'

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

import BookGrid from '@/components/book/BookGrid.vue'
import BookTable, {
  type MarkAsEvent,
  type SortEvent,
  type ToggleFavoriteEvent
} from '@/components/book/BookTable.vue'
import type { FilterState } from '@/components/dialogs/LibraryFiltersDialog.vue'

const { t } = useI18n({ useScope: 'global' })
const settingsStore = useSettingsStore()
const sheetStore = useSheetStore()
const route = useRoute()
const router = useRouter()

const SORT_PROPERTY_DEFAULT = 'createdAt'
const SORT_DIRECTION_DEFAULT = 'desc'
const FAVORITES_DEFAULT = TriState.INDIFERENT
const FUTURE_ITEMS_DEFAULT = TriState.HIDE
const BOOKS_PER_PAGE = 30
const LINKS_COUNT = 6

function castQueryValue(val?: unknown | unknown[]): unknown[] | undefined {
  if (val === undefined) {
    return undefined
  }

  if (Array.isArray(val)) {
    return val
  }

  return [val]
}

const queryParamsSchema = zod.object({
  page: zod.string().regex(/^\d+$/).default('1').transform(Number),
  groups: zod.preprocess(
    (val) => castQueryValue(val),
    zod.string().array().optional()
  ),
  sortProperty: zod
    .enum([
      'title',
      'publisher',
      'status',
      'readAt',
      'boughtAt',
      'paidPrice.value',
      'labelPrice.value',
      'createdAt',
      'updatedAt'
    ])
    .default(SORT_PROPERTY_DEFAULT),
  sortDirection: zod.enum(['asc', 'desc']).default(SORT_DIRECTION_DEFAULT),
  favorites: zod.nativeEnum(TriState).default(FAVORITES_DEFAULT),
  futureItems: zod.nativeEnum(TriState).default(FUTURE_ITEMS_DEFAULT)
})

type QueryParams = zod.output<typeof queryParamsSchema>

const filterOpen = ref(false)

const sheetIsEmpty = computed(() => sheetStore.isEmpty)
const queryParams = reactiveComputed<QueryParams>(() => {
  const result = queryParamsSchema.safeParse(route.query)

  return result.success
    ? result.data
    : {
        page: 1,
        groups: undefined,
        sortProperty: 'createdAt',
        sortDirection: 'desc',
        favorites: TriState.INDIFERENT,
        futureItems: TriState.HIDE
      }
})
const { page, sortProperty, sortDirection, favorites, futureItems } =
  toRefs(queryParams)
// https://github.com/vuejs/core/issues/6420
const queryGroups = toRef(queryParams, 'groups')

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

const sheetId = computed(() => sheetStore.sheetId)
const sheetLoading = computed(() => sheetStore.loading)

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

const { data: groupsData, isLoading: groupsLoading } = useGroupsQuery({
  enabled: queriesEnabled
})
const groups = computed(() => {
  const sheetGroups = (groupsData.value ?? []).map((g) => g.name)

  return queryGroups.value?.filter((g) => sheetGroups.includes(g))
})

const {
  data: booksData,
  isFetching: booksFetching,
  isLoading: booksLoading
} = useBooksQuery(
  {
    favorites,
    futureItems,
    groups,
    page,
    perPage: BOOKS_PER_PAGE,
    sortBy: sortProperty,
    sortDirection
  },
  { enabled: queriesEnabled }
)

const books = computed(() => booksData.value?.books ?? [])
const totalResults = computed(() => booksData.value?.totalResults ?? 0)
const paginator = new PaginatorUtil(BOOKS_PER_PAGE, LINKS_COUNT)
const paginationInfo = computed(() => {
  return paginator.build(totalResults.value, page.value)
})

const loading = computed(() => {
  return booksLoading.value || groupsLoading.value
})

const table = ref<InstanceType<typeof BookTable>>()
const grid = ref<InstanceType<typeof BookGrid>>()
const currentView = computed(() => {
  return viewMode.value === 'table' ? table.value : grid.value
})

const lastFocus = ref<HTMLElement | undefined | null>(null)
const activeElement = useActiveElement()

watch(booksFetching, (value) => {
  if (value) {
    lastFocus.value = activeElement.value
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

watch(booksLoading, async (newValue) => {
  if (newValue) {
    await handleFocus()
  }
})

async function handlePage(page: number) {
  router.push({ name: 'dashboard-library', query: { ...route.query, page } })
}

async function handleFilter(filters: FilterState) {
  router.push({
    name: 'dashboard-library',
    query: {
      favorites:
        filters.favorites !== FAVORITES_DEFAULT ? filters.favorites : undefined,
      futureItems:
        filters.futureItems !== FUTURE_ITEMS_DEFAULT
          ? filters.futureItems
          : undefined,
      groups:
        filters.groups.length > 0 &&
        filters.groups.length !== groupsData.value?.length
          ? filters.groups
          : undefined,
      sortDirection:
        filters.sortDirection !== SORT_DIRECTION_DEFAULT
          ? filters.sortDirection
          : undefined,
      sortProperty:
        filters.sortProperty !== SORT_PROPERTY_DEFAULT
          ? filters.sortProperty
          : undefined,
      page: 1
    }
  })
}

async function handleTableSort({ property, direction }: SortEvent) {
  router.push({
    name: 'dashboard-library',
    query: {
      ...route.query,
      sortProperty: property !== SORT_PROPERTY_DEFAULT ? property : undefined,
      sortDirection:
        direction !== SORT_DIRECTION_DEFAULT ? direction : undefined
    }
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

<route lang="yaml">
meta:
  title: app.routes.dashboard.library
  layout: dashboard
</route>

<template>
  <div class="flex flex-col">
    <LibraryHeader
      :loading="loading"
      :writing="writing"
      :groups="groups"
      :sort-property="sortProperty"
      :sort-direction="sortDirection"
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
          <div
            class="bg-block dark:bg-block-dark px-4 py-4 rounded-xl flex flex-row justify-between items-center"
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
                <div class="flex space-x-1 relative">
                  <div
                    aria-hidden="true"
                    :class="[
                      'w-9 h-9 rounded-md bg-primary-100 dark:bg-gray-600/50 absolute left-0 top-0',
                      'motion-safe:transition-transform',
                      viewMode === 'grid,comfortable' ? 'translate-x-10' : '',
                      viewMode === 'grid,compact' ? 'translate-x-20' : ''
                    ]"
                  />
                  <RadioGroupOption
                    value="table"
                    class="view-button has-ring-focus z-10 !ml-0"
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
                    class="view-button has-ring-focus z-10"
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
                    class="view-button has-ring-focus z-10"
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
                :current-page="page"
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
                :loading="loading || writing"
                :skeleton-items="30"
                :mode="gridMode"
                :blur-nsfw="blurNsfw"
                :spoiler-mode="spoilerMode"
              />
            </FadeTransition>
          </div>

          <div
            v-if="paginationInfo.total_pages > 1"
            class="bg-block dark:bg-block-dark p-4 rounded-xl flex flex-col md:flex-row md:justify-between items-center"
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
      v-if="!sheetIsEmpty"
      v-model:open="filterOpen"
      :favorites="favorites"
      :future-items="futureItems"
      :groups="groups ?? []"
      :sort-direction="sortDirection"
      :sort-property="sortProperty"
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
  @apply text-primary-600 dark:text-gray-300;
}

.view-button[aria-checked='true']:not([aria-disabled='true']):hover {
  @apply bg-primary-100 dark:bg-gray-500/60;
}

.view-button[aria-disabled='true'] {
  @apply opacity-50 cursor-default;
}
</style>
