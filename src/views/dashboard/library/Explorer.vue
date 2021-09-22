<template>
  <div class="flex flex-col">
    <LibraryHeader
      @click:new="openCreateDialog"
      @click:filter="filterOpen = true"
    />

    <div class="flex-1">
      <section
        class="h-full max-w-7xl mx-auto py-6 px-5 md:px-8"
        aria-labelledby="results-title"
        v-if="!sheetIsEmpty"
      >
        <h2 id="results-title" class="sr-only">
          {{ t('dashboard.library.items.current', { group }) }}
        </h2>

        <transition
          mode="out-in"
          leave-active-class="transition motion-reduce:transition-none transform motion-reduce:transform-none duration-200 ease-in"
          leave-from-class="opacity-100 translate-x-0"
          leave-to-class="opacity-0 translate-x-2"
          enter-active-class="transition motion-reduce:transition-none transform motion-reduce:transform-none duration-200 ease-out"
          enter-from-class="opacity-0 -translate-x-2"
          enter-to-class="opacity-100 translate-x-0"
        >
          <TableBooks
            v-if="viewMode === 'table' && books.length > 0"
            :items="books"
            :pagination-info="paginationInfo"
            :sort-direction="sortDirection"
            :sort-property="sortProperty"
            @page="handlePage"
          />

          <GridBooks
            v-else
            :items="books"
            :pagination-info="paginationInfo"
            :skeleton-items="18"
            @page="handlePage"
          />
        </transition>
      </section>

      <!-- Empty collection -->
      <section
        v-if="sheetIsEmpty"
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
        <router-link
          :to="{ name: 'DashboardNewBook' }"
          class="button is-primary text-lg"
        >
          <span aria-hidden="true">
            <PlusIcon aria-hidden="true" />
          </span>
          {{ t('dashboard.library.newBook') }}
        </router-link>
      </section>
    </div>

    <!-- Filters -->
    <LibraryFilters
      v-model:open="filterOpen"
      v-if="!sheetIsEmpty"
      @filter="handleFilter"
    />

    <BookCreateDialog
      :is-open="createDialogOpen"
      @close="closeCreateDialog"
    />
  </div>
</template>

<script>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

import { MutationTypes } from '@/store'

import { PlusIcon } from '@heroicons/vue/solid'
import { ExclamationCircleIcon } from '@heroicons/vue/outline'

import BookCreateDialog from '@/components/BookCreateDialog.vue'
import GridBooks from '@/components/GridBooks'
import LibraryFilters from '@/components/LibraryFilters'
import LibraryHeader from '@/components/LibraryHeader.vue'
import TableBooks from '@/components/TableBooks'

export default {
  name: 'DashboardLibraryExplorer',

  components: {
    BookCreateDialog,
    GridBooks,
    LibraryFilters,
    LibraryHeader,
    TableBooks,
    ExclamationCircleIcon,
    PlusIcon
  },

  setup () {
    const store = useStore()
    const { t } = useI18n()

    const filterOpen = ref(false)

    const sheetIsEmpty = computed(() => store.getters['sheet/sheetIsEmpty'])

    const group = computed(() => store.state.collection.group)
    const paginationInfo = computed(() => store.state.collection.paginationInfo)
    const sortProperty = computed(() => store.state.collection.sortBy)
    const sortDirection = computed(() => store.state.collection.sortDirection)
    const viewMode = computed(() => store.state.collection.viewMode)

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

    const books = computed(() => store.state.collection.books.items)
    const loading = computed(() => store.state.collection.books.loading)
    const currentPage = computed(() => store.state.collection.currentPage)

    const route = useRoute()
    const sheetId = computed(() => store.state.sheet.sheetId)
    const sheetLoading = computed(() => store.state.sheet.loading)

    async function updateGroupFromQuery () {
      const newGroup = route.query.group

      if (sheetLoading.value || loading.value || !newGroup) {
        return
      }

      if (!sheetIsEmpty.value && store.state.collection.groups.items === 0) {
        await store.dispatch('collection/fetchGroups')
      }

      const groupData = store.state.collection.groups.items
        .find(grp => grp.name === newGroup)

      const oldGroup = group.value

      if (groupData && oldGroup !== newGroup) {
        store.commit(MutationTypes.COLLECTION_UPDATE_GROUP, {
          group: newGroup,
          totalResults: groupData.count
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
        store.commit(MutationTypes.COLLECTION_UPDATE_SORT, {
          sortBy: newSortProperty,
          sortDirection: 'desc'
        })

        return true
      }

      return false
    }

    watch(sheetId, async newSheetId => {
      if (newSheetId) {
        const groupChanged = await updateGroupFromQuery()
        const sortChanged = updateSortPropertyFromQuery()

        if (groupChanged || sortChanged || books.value.length === 0) {
          await store.dispatch(
            'collection/fetchBooks',
            sortChanged ? 1 : currentPage.value
          )
        }
      }
    })

    onMounted(async () => {
      if (sheetId.value) {
        const groupChanged = await updateGroupFromQuery()
        const sortChanged = updateSortPropertyFromQuery()

        if (groupChanged || sortChanged || books.value.length === 0) {
          await store.dispatch(
            'collection/fetchBooks',
            sortChanged ? 1 : currentPage.value
          )
        }
      }
    })

    function handlePage (page) {
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
      })

      nextTick(() => {
        const totalResults = store.state.collection.paginationInfo.total_results
        store.commit(MutationTypes.COLLECTION_UPDATE_CURRENT_PAGE, { page, totalResults })

        store.dispatch('collection/fetchBooks', page)
      })
    }

    async function handleFilter (filters) {
      store.commit(MutationTypes.COLLECTION_UPDATE_VIEW_MODE, filters.viewMode)
      store.commit(MutationTypes.COLLECTION_UPDATE_GRID_MODE, filters.gridMode)

      if (store.state.collection.group !== filters.group ||
          store.state.collection.sortBy !== filters.sortProperty ||
          store.state.collection.sortDirection !== filters.sortDirection) {
        const totalResults = store.state.collection.paginationInfo.total_results
        store.commit(MutationTypes.COLLECTION_UPDATE_CURRENT_PAGE, { page: 1, totalResults })

        store.commit(MutationTypes.COLLECTION_UPDATE_GROUP, { group: filters.group })
        store.commit(MutationTypes.COLLECTION_UPDATE_SORT, {
          sortBy: filters.sortProperty,
          sortDirection: filters.sortDirection
        })

        store.dispatch('collection/fetchBooks', 1)
      }
    }

    const createDialogOpen = ref(false)

    function openCreateDialog () {
      createDialogOpen.value = true
    }

    function closeCreateDialog () {
      createDialogOpen.value = false
    }

    return {
      filterOpen,
      sheetIsEmpty,
      group,
      handlePage,
      sheetLoading,
      loading,
      books,
      paginationInfo,
      sortDirection,
      sortProperty,
      sortPropertyName,
      viewMode,
      handleFilter,
      createDialogOpen,
      openCreateDialog,
      closeCreateDialog,
      t
    }
  }
}
</script>
