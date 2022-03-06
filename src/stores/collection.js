import { acceptHMRUpdate, defineStore } from 'pinia'
import Paginator from 'paginator'
import { StorageSerializers, useLocalStorage } from '@vueuse/core'

export const HIDE = 'hide'
export const ONLY = 'only'
export const INDIFERENT = 'indiferent'

export const useCollectionStore = defineStore('collection', {
  state: () => ({
    currentPage: 1,
    filters: {
      groups: useLocalStorage('collection_groups', [])
    },
    favorites: useLocalStorage('collection_favorites', INDIFERENT),
    futureItems: useLocalStorage('collection_future_items', HIDE),
    links: 6,
    paginationInfo: {},
    perPage: 18,
    sortBy: useLocalStorage('collection_sort_by', 'createdAt'),
    sortDirection: useLocalStorage('collection_sort_direction', 'desc')
  }),
  actions: {
    buildPaginationInfo({ perPage, links, totalResults, page }) {
      const paginator = new Paginator(perPage, links)

      return paginator.build(totalResults, page)
    },

    updateCurrentPage({ page, totalResults }) {
      this.currentPage = page

      this.paginationInfo = {
        ...this.paginationInfo,
        ...this.buildPaginationInfo({
          perPage: this.perPage,
          links: this.links,
          totalResults,
          page
        })
      }
    },

    updateFavorites(favorites) {
      this.favorites = favorites
    },

    updateFutureItems(futureItems) {
      this.futureItems = futureItems
    },

    updateGroups(groups) {
      this.filters.groups = groups || []
    },

    updateSort({ sortBy, sortDirection }) {
      this.sortBy = sortBy || this.sortBy
      this.sortDirection = sortDirection || this.sortDirection
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCollectionStore, import.meta.hot))
}
