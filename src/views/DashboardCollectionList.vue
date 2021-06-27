<template>
  <div>
    <header class="bg-white shadow dark:bg-gray-800">
      <div class="max-w-7xl mx-auto lg:flex lg:items-center lg:justify-between py-6 px-4 sm:px-6 lg:px-8">
        <div class="flex-1 items-center">
          <template v-if="loading">
            <div class="animate-pulse h-9 bg-gray-400 dark:bg-gray-600 rounded w-56 mb-1"></div>
            <div class="animate-pulse h-4 bg-gray-400 dark:bg-gray-600 rounded w-32"></div>
          </template>
          <template v-else>
            <h1 class="text-3xl font-title font-bold text-gray-900 dark:text-gray-100">
              Coleção
            </h1>
            <p class="text-gray-500 dark:text-gray-400">
              {{ group }}
            </p>
          </template>
        </div>
        <div class="flex mt-5 lg:mt-0 lg:ml-4">
          <template v-if="loading">
            <div class="animate-pulse h-9 bg-gray-400 dark:bg-gray-600 rounded w-28 mr-2"></div>
            <div class="animate-pulse h-9 bg-gray-400 dark:bg-gray-600 rounded w-32"></div>
          </template>
          <template v-else>
            <button
              type="button"
              class="button mr-2"
              @click.stop="filterOpen = true"
            >
              <FilterIcon aria-hidden="true" />
              Filtrar
            </button>
            <router-link
              :to="{ name: 'DashboardNewBook' }"
              class="button is-primary"
            >
              <PlusIcon aria-hidden="true" />
              Novo livro
            </router-link>
          </template>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto py-6 px-5 md:px-8">
      <transition
        mode="out-in"
        leave-active-class="transition transform duration-200 ease-in"
        leave-from-class="opacity-100 translate-x-0"
        leave-to-class="opacity-0 translate-x-2"
        enter-active-class="transition transform duration-200 ease-out"
        enter-from-class="opacity-0 -translate-x-2"
        enter-to-class="opacity-100 translate-x-0"
      >
        <TableBooks
          v-if="viewMode === 'table' && results.length > 0"
          :items="results"
          :pagination-info="paginationInfo"
          :sort-direction="sortDirection"
          :sort-property="sortProperty"
          @page="handlePage"
        />

        <GridBooks
          v-else
          :items="results"
          :pagination-info="paginationInfo"
          :skeleton-items="18"
          :loading="loading"
          @page="handlePage"
        />
      </transition>
    </div>

    <!-- Filters -->
    <CollectionFilters v-model:open="filterOpen" />
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'

import orderBy from 'lodash.orderby'

import {
  FilterIcon,
  PlusIcon
} from '@heroicons/vue/solid'

import CollectionFilters from '@/components/CollectionFilters'
import GridBooks from '@/components/GridBooks.vue'
import TableBooks from '@/components/TableBooks.vue'

export default {
  name: 'DashboardCollectionList',

  components: {
    CollectionFilters,
    GridBooks,
    TableBooks,
    FilterIcon,
    PlusIcon
  },

  setup () {
    const store = useStore()

    const filterOpen = ref(false)

    const currentPage = computed(() => store.state.collection.currentPage)
    const group = computed(() => store.state.collection.group)
    const paginationInfo = computed(() => store.state.collection.paginationInfo)
    const perPage = computed(() => store.state.collection.perPage)
    const sortProperty = computed(() => store.state.collection.sortBy)
    const sortDirection = computed(() => store.state.collection.sortDirection)
    const viewMode = computed(() => store.state.collection.viewMode)

    const groupItems = computed(() => {
      return store.state.sheet.collection[store.state.collection.group] || []
    })

    const results = computed(() => {
      if (groupItems.value.length === 0) {
        return []
      }

      const startIndex = (currentPage.value - 1) * perPage.value
      const endIndex = startIndex + perPage.value

      let sorted = groupItems.value

      if (sortProperty.value !== 'title') {
        sorted = orderBy(
          groupItems.value,
          [sortProperty.value],
          [sortDirection.value]
        )
      } else if (sortProperty.value === 'title' && sortDirection.value === 'desc') {
        sorted = groupItems.value.slice().reverse()
      }

      return sorted.slice(startIndex, endIndex)
    })

    const loading = computed(() => store.state.sheet.loading)

    function handlePage (page) {
      store.commit('collection/updateCurrentPage', {
        page,
        totalResults: groupItems.value.length
      })

      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
      })
    }

    return {
      filterOpen,
      group,
      groupItems,
      handlePage,
      loading,
      paginationInfo,
      results,
      sortDirection,
      sortProperty,
      viewMode
    }
  }
}
</script>

<style>

</style>
