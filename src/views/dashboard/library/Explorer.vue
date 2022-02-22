<template>
  <div class="flex flex-col">
    <LibraryHeader
      :writing="writing"
      @click:new="openCreateDialog"
      @click:filter="filterOpen = true"
    />

    <div class="flex-1">
      <FadeTransition>
        <section
          class="h-full max-w-7xl mx-auto pt-4 sm:pt-6 px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-6 !mb-6"
          aria-labelledby="results-title"
          v-if="(books.length > 0 || sheetLoading || loading || writing) && !sheetIsEmpty"
        >
          <h2 id="results-title" class="sr-only" hidden aria-live="polite" aria-hidden="true">
            {{
              t('dashboard.library.items.current', groups.selected.length, {
                count: groups.selected.length === 1
                  ? groups.selected[0]
                  : groups.selected.length
              })
            }}
          </h2>

          <div class="bg-white dark:bg-gray-800 px-4 py-4 md:py-3 sm:px-6 -mx-4 sm:-mx-6 md:mx-0 shadow md:rounded-md flex flex-row justify-between items-center">
            <div
              v-if="(sheetLoading && !writing) || (loading && books.length === 0)"
              class="skeleton h-5 w-40 md:w-48"
            />
            <div v-else>
              <i18n-t
                keypath="pagination.text"
                tag="p"
                class="text-xs sm:text-sm text-gray-700 dark:text-gray-300"
                scope="global"
              >
                <span class="font-semibold dark:text-gray-100"> {{ paginationInfo.current_page || 1 }} </span>
                <span class="font-semibold dark:text-gray-100"> {{ paginationInfo.total_pages || 1 }} </span>
                <span class="font-semibold dark:text-gray-100"> {{ paginationInfo.total_results || 0 }} </span>
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
                      <TableIcon class="h-5 w-5" />
                    </span>
                  </RadioGroupOption>
                  <RadioGroupOption
                    value="grid,comfortable"
                    class="view-button has-ring-focus"
                    :title="t('dashboard.library.filters.gridMode.comfortableGrid')"
                  >
                    <span class="sr-only">
                      {{ t('dashboard.library.filters.gridMode.comfortableGrid') }}
                    </span>
                    <span aria-hidden="true">
                      <ViewGridIcon class="h-5 w-5" />
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
                      <ViewGridAddIcon class="h-5 w-5" />
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
                :skeleton-items="18"
              />
            </FadeTransition>
          </div>

          <div
            v-if="paginationInfo.total_pages > 1"
            class="bg-white dark:bg-gray-800 px-4 py-4 md:py-3 sm:px-6 shadow md:rounded-md flex -mx-4 sm:-mx-6 md:mx-0 flex-col md:flex-row md:justify-between items-center"
          >
            <div
              v-if="(sheetLoading && !writing) || (loading && books.length === 0)"
              class="skeleton h-5 w-40 md:w-48"
            />
            <div v-else>
              <i18n-t
                keypath="pagination.text"
                tag="p"
                class="text-sm text-gray-700 dark:text-gray-300 mb-4 md:mb-0"
                scope="global"
              >
                <span class="font-semibold dark:text-gray-100"> {{ paginationInfo.current_page }} </span>
                <span class="font-semibold dark:text-gray-100"> {{ paginationInfo.total_pages }} </span>
                <span class="font-semibold dark:text-gray-100"> {{ paginationInfo.total_results }} </span>
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
                    v-if="(sheetLoading && !writing) || (loading && books.length === 0)"
                    class="skeleton h-9 w-28"
                  />
                  <button
                    v-else
                    type="button"
                    class="button"
                    :disabled="!paginationInfo.has_previous_page || loading || writing"
                    @click.stop="handlePage(paginationInfo.current_page - 1)"
                  >
                    <span aria-hidden="true">
                      <ChevronLeftIcon aria-hidden="true" />
                    </span>
                    {{ t('pagination.previous') }}
                  </button>
                </li>

                <li>
                  <div
                    v-if="(sheetLoading && !writing) || (loading && books.length === 0)"
                    class="skeleton h-9 w-28"
                  />
                  <button
                    v-else
                    type="button"
                    class="button"
                    :disabled="!paginationInfo.has_next_page || loading || writing"
                    @click.stop="handlePage(paginationInfo.current_page + 1)"
                  >
                    {{ t('pagination.next') }}
                    <span aria-hidden="true">
                      <ChevronRightIcon class="is-right" aria-hidden="true" />
                    </span>
                  </button>
                </li>
              </ul>
            </nav>

            <div
              v-if="(sheetLoading && !writing) || (loading && books.length === 0)"
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
            <ExclamationCircleIcon class="h-16 w-16 mb-8 text-gray-400 dark:text-gray-600" />
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
          <button
            v-if="canEdit"
            class="button is-primary text-lg"
            @click="openCreateDialog"
          >
            <span aria-hidden="true">
              <PlusIcon aria-hidden="true" />
            </span>
            {{ t('dashboard.library.newBook') }}
          </button>
        </section>

        <section
          v-else-if="books.length === 0"
          aria-labelledby="empty-sheet-title"
          class="w-full max-w-lg mx-auto h-full flex items-center justify-center flex-col px-4"
        >
          <span aria-hidden="true">
            <DocumentSearchIcon class="h-16 w-16 mb-8 text-gray-400 dark:text-gray-600" />
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
          <button
            class="button text-lg"
            @click="filterOpen = true"
          >
            <span aria-hidden="true">
              <FilterIcon />
            </span>
            {{ t('dashboard.library.filter') }}
          </button>
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

<script>
import { computed, nextTick, onBeforeMount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

import useBookBulkDeleter from '@/composables/useBookBulkDeleter'
import useBookBulkEditor from '@/composables/useBookBulkEditor'
import { useCollectionStore } from '@/stores/collection'
import { useSettingsStore } from '@/stores/settings'
import { useSheetStore } from '@/stores/sheet'

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  FilterIcon,
  PlusIcon
} from '@heroicons/vue/solid'
import {
  DocumentSearchIcon,
  ExclamationCircleIcon,
  TableIcon,
  ViewGridAddIcon,
  ViewGridIcon
} from '@heroicons/vue/outline'

import { RadioGroup, RadioGroupLabel, RadioGroupOption } from '@headlessui/vue'

import BookCreateDialog from '@/components/dialogs/BookCreateDialog.vue'
import BookDeleteDialog from '@/components/dialogs/BookDeleteDialog.vue'
import BookGrid from '@/components/book/BookGrid.vue'
import BookTable from '@/components/book/BookTable.vue'
import FadeTransition from '@/components/transitions/FadeTransition.vue'
import LibraryFiltersDialog from '@/components/dialogs/LibraryFiltersDialog.vue'
import LibraryHeader from '@/components/LibraryHeader.vue'
import Paginator from '@/components/Paginator.vue'

import cloneDeep from 'lodash.clonedeep'
import { STATUS_READ } from '@/model/Book'

export default {
  components: {
    BookCreateDialog,
    BookDeleteDialog,
    BookGrid,
    BookTable,
    FadeTransition,
    ChevronLeftIcon,
    ChevronRightIcon,
    DocumentSearchIcon,
    ExclamationCircleIcon,
    FilterIcon,
    LibraryFiltersDialog,
    LibraryHeader,
    Paginator,
    PlusIcon,
    RadioGroup,
    RadioGroupLabel,
    RadioGroupOption,
    TableIcon,
    ViewGridAddIcon,
    ViewGridIcon
  },

  setup () {
    const { t } = useI18n({ useScope: 'global' })
    const collectionStore = useCollectionStore()
    const settingsStore = useSettingsStore()
    const sheetStore = useSheetStore()

    const filterOpen = ref(false)

    const sheetIsEmpty = computed(() => sheetStore.sheetIsEmpty)

    const paginationInfo = computed(() => collectionStore.paginationInfo)
    const sortProperty = computed(() => collectionStore.sortBy)
    const sortDirection = computed(() => collectionStore.sortDirection)

    const viewMode = computed({
      get () {
        if (settingsStore.viewMode === 'table') {
          return 'table'
        }

        return settingsStore.viewMode + ',' + settingsStore.gridMode
      },
      set (value) {
        const [viewMode, gridMode] = value.split(',')

        settingsStore.updateViewMode(viewMode)

        if (gridMode) {
          settingsStore.updateGridMode(gridMode)
        }

        selection.value = []
      }
    })

    const sortPropertyNames = {
      title: t('book.properties.title'),
      publisher: t('book.properties.publisher'),
      status: t('book.properties.status'),
      readAt: t('book.properties.readAt'),
      'paidPrice.value': t('book.properties.paidPrice'),
      'labelPrice.value': t('book.properties.labelPrice'),
      createdAt: t('book.properties.createdAt'),
      updatedAt: t('book.properties.updatedAt')
    }

    const sortPropertyName = computed(() => sortPropertyNames[sortProperty.value])

    const books = computed(() => collectionStore.books.items)
    const loading = computed(() => {
      return collectionStore.books.loading ||
        collectionStore.filters.groups.loading
    })
    const currentPage = computed(() => collectionStore.currentPage)

    const route = useRoute()
    const sheetId = computed(() => sheetStore.sheetId)
    const sheetLoading = computed(() => sheetStore.loading)
    const sheetLoadedOnce = computed(() => sheetStore.loadedOnce)

    const groups = computed(() => collectionStore.filters.groups)

    async function updateGroupFromQuery () {
      const newGroup = route.query.group

      if (sheetLoading.value || loading.value || !newGroup) {
        return false
      }

      if (!sheetIsEmpty.value && groups.value.items.length === 0) {
        await collectionStore.fetchGroups()
      }

      const groupExists = groups.value.items
        .find(grp => grp.name === newGroup)

      if (groupExists) {
        collectionStore.updateGroups({
          selected: [newGroup]
        })

        return true
      }

      return false
    }

    function updateSortPropertyFromQuery () {
      const newSortProperty = route.query.sortProperty

      if (sheetLoading.value || loading.value || !newSortProperty) {
        return false
      }

      if (!sortPropertyNames[newSortProperty]) {
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

    async function updateFromQuery () {
      const groupChanged = await updateGroupFromQuery()
      const sortChanged = updateSortPropertyFromQuery()

      if (groupChanged || sortChanged || books.value.length === 0) {
        await collectionStore.fetchBooks(sortChanged ? 1 : currentPage.value)
      }
    }

    watch(sheetLoading, async newSheetLoading => {
      if (!newSheetLoading) {
        collectionStore.updateLoading('books', true)
        await updateFromQuery()
      }
    })

    onBeforeMount(() => {
      if (sheetId.value && books.value.length === 0) {
        collectionStore.updateLoading('books', true)
      }
    })

    onMounted(async () => {
      if (sheetId.value) {
        await updateFromQuery()
      }
    })

    const table = ref(null)
    const grid = ref(null)

    async function handlePage (page) {
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
      })

      const totalResults = collectionStore.paginationInfo.total_results
      collectionStore.updateCurrentPage({ page, totalResults })

      await collectionStore.fetchBooks(page)

      nextTick(() => {
        const display = (viewMode.value === 'table' ? table : grid)

        display.value?.focus()
      })
    }

    async function handleFilter (filters) {
      selection.value = []

      if (collectionStore.filters.groups.selected !== filters.groups ||
          collectionStore.sortBy !== filters.sortProperty ||
          collectionStore.sortDirection !== filters.sortDirection ||
          collectionStore.favorites !== filters.favorites ||
          collectionStore.futureItems !== filters.futureItems) {
        const totalResults = collectionStore.paginationInfo.total_results
        collectionStore.updateCurrentPage({
          page: 1,
          totalResults
        })

        collectionStore.updateGroups({ selected: filters.groups })
        collectionStore.updateSort({
          sortBy: filters.sortProperty,
          sortDirection: filters.sortDirection
        })
        collectionStore.updateFavorites(filters.favorites)
        collectionStore.updateFutureItems(filters.futureItems)

        await collectionStore.fetchBooks(1)

        nextTick(() => {
          const display = (viewMode.value === 'table' ? table : grid)

          display.value?.focus()
        })
      }
    }

    async function handleTableSort ({ property, direction }) {
      const totalResults = collectionStore.paginationInfo.total_results
      collectionStore.updateCurrentPage({
        page: 1,
        totalResults
      })

      collectionStore.updateSort({
        sortBy: property,
        sortDirection: direction
      })

      await collectionStore.fetchBooks(1)

      nextTick(() => table.value?.focusOnActiveHeader())
    }

    const createDialogOpen = ref(false)

    function openCreateDialog () {
      createDialogOpen.value = true
    }

    function closeCreateDialog () {
      createDialogOpen.value = false
    }

    const canEdit = computed(() => sheetStore.canEdit)

    const selection = ref([])
    const booksToDelete = computed(() => {
      return selection.value.map(idx => books.value[idx])
    })

    const deleteDialogOpen = ref(false)
    const { bulkDeleteBooks, deleting } = useBookBulkDeleter(booksToDelete)

    async function handleDeleteSelection () {
      await bulkDeleteBooks()
    }

    const { bulkUpdateBooks, updating } = useBookBulkEditor()

    async function handleBulkMarkAs ({ booksToEdit, newStatus }) {
      const editedBooks = booksToEdit
        .filter(book => book.status !== newStatus)
        .map(book => {
          /** @type {import('@/model/Book').default} */
          const clone = cloneDeep(book)
          clone.status = newStatus
          clone.readAt = newStatus === STATUS_READ ? new Date() : null
          return clone
        })

      await bulkUpdateBooks(editedBooks)
    }

    async function handleBulkToggleFavorite ({ booksToEdit, newFavorite }) {
      const editedBooks = booksToEdit
        .filter(book => book.favorite !== newFavorite)
        .map(book => {
          const clone = cloneDeep(book)
          clone.favorite = newFavorite
          return clone
        })

      await bulkUpdateBooks(editedBooks)
    }

    const writing = computed(() => deleting.value || updating.value)

    return {
      filterOpen,
      sheetIsEmpty,
      handlePage,
      sheetLoading,
      sheetLoadedOnce,
      loading,
      books,
      paginationInfo,
      sortDirection,
      sortProperty,
      sortPropertyName,
      viewMode,
      handleFilter,
      handleTableSort,
      createDialogOpen,
      openCreateDialog,
      closeCreateDialog,
      canEdit,
      groups,
      selection,
      deleteDialogOpen,
      handleDeleteSelection,
      handleBulkMarkAs,
      handleBulkToggleFavorite,
      writing,
      table,
      grid,
      t
    }
  }
}
</script>

<style lang="postcss" scoped>
.view-button {
  @apply p-2 rounded-md
    text-gray-500 dark:text-gray-400
    motion-safe:transition cursor-pointer;
}

.view-button:not([aria-disabled="true"]):hover {
  @apply bg-gray-700/10 dark:bg-gray-200/10;
}

.view-button:not([aria-disabled="true"]):hover:not([aria-checked="true"]) {
  @apply text-gray-600 dark:text-gray-300;
}

.view-button:focus {
  @apply outline-none;
}

.view-button[aria-checked="true"] {
  @apply text-primary-600 dark:text-gray-300
    bg-primary-50 dark:bg-gray-600/50;
}

.view-button[aria-checked="true"]:not([aria-disabled="true"]):hover {
  @apply bg-primary-100 dark:bg-gray-500/60;
}

.view-button[aria-disabled="true"] {
  @apply opacity-50 cursor-default;
}
</style>
