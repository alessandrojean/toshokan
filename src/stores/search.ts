import { acceptHMRUpdate, defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import type Paginator from 'paginator'
import type { Sort } from '@/types'

type PaginationInfo = ReturnType<Paginator['build']>

type UpdateSortArgs = {
  sortBy?: string
  sortDirection?: Sort
}

export const useSearchStore = defineStore('search', {
  state: () => ({
    history: useLocalStorage<string[]>('search_history', []),
    query: '',
    page: 1,
    pagination: null as PaginationInfo | null,
    sortBy: useLocalStorage('search_sort_by', 'createdAt'),
    sortDirection: useLocalStorage<Sort>('search_sort_direction', 'desc')
  }),
  actions: {
    clear() {
      this.$patch({
        query: '',
        page: 1,
        pagination: null
      })
    },

    updateHistory(history: string[]) {
      this.history = history
    },

    updatePage(page: number) {
      this.page = page
    },

    updatePagination(pagination: PaginationInfo) {
      this.pagination = {
        ...this.pagination,
        ...pagination
      }
    },

    updateQuery(query: string) {
      this.query = query
    },

    updateSort({ sortBy, sortDirection }: UpdateSortArgs) {
      this.sortBy = sortBy ?? this.sortBy
      this.sortDirection = sortDirection ?? this.sortDirection
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSearchStore, import.meta.hot))
}
