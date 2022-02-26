import { defineStore } from 'pinia'

export const useSearchStore = defineStore('search', {
  state: () => ({
    history: localStorage.getItem('search_history')
      ? JSON.parse(localStorage.getItem('search_history'))
      : [],
    query: '',
    page: 1,
    pagination: null,
    sortBy: 'createdAt',
    sortDirection: 'desc'
  }),
  actions: {
    clear () {
      this.$patch({
        query: '',
        page: 1,
        paginationInfo: null,
        sortBy: 'createdAt',
        sortDirection: 'desc'
      })
    },

    updateHistory (history) {
      this.history = history
      localStorage.setItem('search_history', JSON.stringify(history))
    },

    updatePage (page) {
      this.page = page
    },

    updatePagination (pagination) {
      this.pagination = {
        ...this.pagination,
        ...pagination
      }
    },

    updateQuery (query) {
      this.query = query
    },

    updateSort ({ sortBy, sortDirection }) {
      this.sortBy = sortBy || this.sortBy
      this.sortDirection = sortDirection || this.sortDirection
    }
  }
})
