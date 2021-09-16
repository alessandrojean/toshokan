<template>
  <div class="flex flex-col">
    <header class="bg-white shadow dark:bg-gray-800">
      <div class="max-w-7xl mx-auto md:flex md:items-center md:justify-between py-4 px-4 sm:px-6 lg:px-8">
        <div class="flex-1 items-center">
          <template v-if="sheetLoading">
            <div class="motion-safe:animate-pulse h-9 bg-gray-400 dark:bg-gray-600 rounded w-56 mb-2"></div>
            <div class="flex space-x-2">
              <div class="motion-safe:animate-pulse h-5 bg-gray-400 dark:bg-gray-600 rounded w-32"></div>
              <div class="motion-safe:animate-pulse h-5 bg-gray-400 dark:bg-gray-600 rounded w-24"></div>
            </div>
          </template>
          <template v-else>
            <h1 class="text-xl font-display font-semibold text-gray-900 dark:text-gray-100">
              {{ t('dashboard.library.title') }}
            </h1>
            <ul class="mt-1 flex flex-col md:flex-row items-start sm:flex-wrap md:mt-0 sm:space-x-6">
              <li class="mt-2 flex items-center text-sm text-gray-600 dark:text-gray-300">
                <span aria-hidden="true">
                  <ArchiveIcon class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-400" aria-hidden="true" />
                </span>
                <span class="sr-only">
                  {{ t('dashboard.library.currentGroup') }}
                </span>
                {{ group }}
              </li>

              <li class="mt-2 flex items-center text-sm text-gray-600 dark:text-gray-300">
                <span aria-hidden="true">
                  <SwitchVerticalIcon class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-400" aria-hidden="true" />
                </span>
                <span class="sr-only">
                  {{ t('dashboard.library.sortingBy') }}
                </span>
                {{ sortPropertyName }}
              </li>
            </ul>
          </template>
        </div>
        <div class="flex mt-5 md:mt-0 md:ml-4 space-x-4">
          <template v-if="sheetLoading">
            <div class="motion-safe:animate-pulse h-9 bg-gray-400 dark:bg-gray-600 rounded w-28 flex-1 md:flex-initial"></div>
            <div class="motion-safe:animate-pulse h-9 bg-gray-400 dark:bg-gray-600 rounded w-32 flex-1 md:flex-initial"></div>
          </template>
          <template v-else>
            <button
              type="button"
              class="button flex-1 md:flex-initial justify-center md:justify-start"
              @click.stop="filterOpen = true"
              v-if="!sheetIsEmpty"
              :disabled="loading"
            >
              <span aria-hidden="true">
                <FilterIcon aria-hidden="true" />
              </span>
              {{ t('dashboard.library.filter') }}
            </button>
            <router-link
              :to="{ name: 'DashboardNewBook' }"
              class="button is-primary flex-1 md:flex-initial justify-center md:justify-start"
            >
              <span aria-hidden="true">
                <PlusIcon aria-hidden="true" />
              </span>
              {{ t('dashboard.library.newBook') }}
            </router-link>
          </template>
        </div>
      </div>
    </header>

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

    <!-- <GroupChips /> -->
  </div>
</template>

<script>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

import { MutationTypes } from '@/store'

import {
  ArchiveIcon,
  FilterIcon,
  PlusIcon,
  SwitchVerticalIcon
} from '@heroicons/vue/solid'

import { ExclamationCircleIcon } from '@heroicons/vue/outline'

import GridBooks from '@/components/GridBooks'
import LibraryFilters from '@/components/LibraryFilters'
import TableBooks from '@/components/TableBooks'

export default {
  name: 'DashboardLibraryExplorer',

  components: {
    GridBooks,
    LibraryFilters,
    TableBooks,
    ArchiveIcon,
    ExclamationCircleIcon,
    FilterIcon,
    PlusIcon,
    SwitchVerticalIcon
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
      t
    }
  }
}
</script>

<style>

</style>
