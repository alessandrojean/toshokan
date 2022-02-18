import { defineStore } from 'pinia'
import Paginator from 'paginator'

import SheetService from '@/services/sheet'
import { useSheetStore } from '@/stores/sheet'

export const useSearchStore = defineStore('search', {
  state: () => ({
    history: localStorage.getItem('search_history')
      ? JSON.parse(localStorage.getItem('search_history'))
      : [],
    query: '',
    page: 1,
    pagination: null,
    sortBy: 'createdAt',
    sortDirection: 'desc',
    results: [],
    loading: false
  }),
  actions: {
    clear () {
      this.$patch({
        query: '',
        page: 1,
        paginationInfo: null,
        sortBy: 'createdAt',
        sortDirection: 'desc',
        results: [],
        loading: false
      })
    },

    async search ({ query, sortBy, sortDirection, page = 1 }) {
      this.$patch({
        loading: true,
        page,
        query
      })

      const sheetStore = useSheetStore()
      const sheetId = sheetStore.sheetId

      try {
        this.$patch({
          sortBy: sortBy || this.sortBy,
          sortDirection: sortDirection || this.sortDirection
        })

        const { results, total } = await SheetService.searchBooks({
          sheetId,
          searchTerm: query,
          sort: {
            sortBy: this.sortBy,
            sortDirection: this.sortDirection
          },
          page
        })

        const newHistory = [query].concat(this.history)

        this.$patch({
          results,
          history: Array.from(new Set(newHistory)).slice(0, 6),
          pagination: new Paginator(this.perPage, 4)
            .build(total, this.page)
        })
      } catch (e) {
        this.$patch({
          results: [],
          page: 1,
          pagination: null
        })
      } finally {
        this.loading = false
      }
    },

    updateHistory (history) {
      this.history = history
      localStorage.setItem('search_history', JSON.stringify(history))
    },

    updateSort ({ sortBy, sortDirection }) {
      this.sortBy = sortBy || this.sortBy
      this.sortDirection = sortDirection || this.sortDirection
    }
  }
})
