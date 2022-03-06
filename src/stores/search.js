import { acceptHMRUpdate, defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

export const useSearchStore = defineStore('search', {
  state: () => ({
    history: useLocalStorage('search_history', []),
    query: '',
    page: 1,
    pagination: null,
    sortBy: useLocalStorage('search_sort_by', 'createdAt'),
    sortDirection: useLocalStorage('search_sort_direction', 'desc')
  }),
  actions: {
    clear() {
      this.$patch({
        query: '',
        page: 1,
        pagination: null
      })
    },

    updateHistory(history) {
      this.history = history
    },

    updatePage(page) {
      this.page = page
    },

    updatePagination(pagination) {
      this.pagination = {
        ...this.pagination,
        ...pagination
      }
    },

    updateQuery(query) {
      this.query = query
    },

    updateSort({ sortBy, sortDirection }) {
      this.sortBy = sortBy || this.sortBy
      this.sortDirection = sortDirection || this.sortDirection
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSearchStore, import.meta.hot))
}
