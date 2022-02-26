import { defineStore } from 'pinia'
import Paginator from 'paginator'

export const HIDE = 'hide'
export const ONLY = 'only'
export const INDIFERENT = 'indiferent'

export const useCollectionStore = defineStore('collection', {
  state: () => ({
    currentPage: 1,
    filters: {
      groups: JSON.parse(localStorage.getItem('collection_groups') || '[]')
    },
    favorites: INDIFERENT,
    futureItems: HIDE,
    links: 6,
    paginationInfo: {},
    perPage: 18,
    sortBy: 'createdAt',
    sortDirection: 'desc'
  }),
  actions: {
    buildPaginationInfo ({ perPage, links, totalResults, page }) {
      const paginator = new Paginator(perPage, links)

      return paginator.build(totalResults, page)
    },

    updateCurrentPage ({ page, totalResults }) {
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

    updateFavorites (favorites) {
      this.favorites = favorites
    },

    updateFutureItems (futureItems) {
      this.futureItems = futureItems
    },

    updateGroups (groups) {
      this.filters.groups = groups || []

      localStorage.setItem('collection_groups', JSON.stringify(groups || []))
    },

    updateSort ({ sortBy, sortDirection }) {
      this.sortBy = sortBy || this.sortBy
      this.sortDirection = sortDirection || this.sortDirection
    }
  }
})
