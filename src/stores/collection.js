import { defineStore } from 'pinia'
import Paginator from 'paginator'

import SheetService from '@/services/sheet'
import { PropertyToColumn } from '@/model/Book'

import { useSheetStore } from './sheet'

function buildPaginationInfo ({ perPage, links, totalResults, page }) {
  const paginator = new Paginator(perPage, links)

  return paginator.build(totalResults, page)
}

export const HIDE = 'hide'
export const ONLY = 'only'
export const INDIFERENT = 'indiferent'

export const useCollectionStore = defineStore('collection', {
  state: () => ({
    books: {
      items: [],
      loading: false
    },
    carousels: {
      lastAdded: {
        items: [],
        loading: false
      },
      latestReadings: {
        items: [],
        loading: false
      }
    },
    currentPage: 1,
    filters: {
      groups: {
        items: [],
        loading: false,
        selected: JSON.parse(localStorage.getItem('collection_groups') || '[]')
      },
      publishers: {
        items: [],
        loading: false
      },
      stores: {
        items: [],
        loading: false
      }
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
    /**
     * Clear the items in the specified collections.
     *
     * @param {string} key The type of collection
     * @param  {...string} items The items to clear
     */
    clearItems (key, ...items) {
      const fn = typeof key === 'string'
        ? item => { this[key][item].items = [] }
        : item => { this[item].items = [] }

      items.forEach(fn)
    },

    clearCarouselItems (...carousels) {
      this.clearItems('carousels', ...carousels)
    },

    clearFilterItems (...filters) {
      this.clearItems('filters', ...filters)
    },

    async fetchBooks (page) {
      this.books.loading = true

      page = page || this.currentPage

      const sheetStore = useSheetStore()
      const sheetId = sheetStore.sheetId

      try {
        if (this.filters.groups.items.length === 0) {
          await this.fetchGroups()
        }

        let groups = this.filters.groups.selected
        const allGroups = this.filters.groups.items.map(grp => grp.name)
        const groupData = groups.filter(grp => allGroups.includes(grp))

        if (groupData.length === 0) {
          groups = allGroups
        } else if (groupData.length < allGroups.length) {
          groups = groupData
        }

        const orderBy = PropertyToColumn[this.sortBy]
        const orderDirection = this.sortDirection
        const favorites = this.favorites
        const futureItems = this.futureItems

        const { books, totalResults } = await SheetService.getBooks(sheetId, page, {
          favorites,
          futureItems,
          groups,
          orderBy,
          orderDirection
        })

        this.books.items = books
        this.updateCurrentPage({ page, totalResults })
        this.updateGroups({ selected: groups })
      } finally {
        this.books.loading = false
      }
    },

    async fetchGroups () {
      this.filters.groups.loading = true
      this.clearFilterItems('groups')

      const sheetStore = useSheetStore()
      const sheetId = sheetStore.sheetId

      try {
        const groups = await SheetService.getGroups(sheetId)
        this.filters.groups.items = groups
      } finally {
        this.filters.groups.loading = false
      }
    },

    async fetchLastAdded () {
      this.carousels.lastAdded.loading = true
      this.clearCarouselItems('lastAdded')

      const sheetStore = useSheetStore()
      const sheetId = sheetStore.sheetId

      try {
        const lastAdded = await SheetService.getBooks(sheetId, 1, {
          limit: 6,
          dontCount: true
        })
        this.carousels.lastAdded.items = lastAdded.books
      } finally {
        this.carousels.lastAdded.loading = false
      }
    },

    async fetchLatestReadings () {
      this.carousels.latestReadings.loading = true
      this.clearCarouselItems('latestReadings')

      const sheetStore = useSheetStore()
      const sheetId = sheetStore.sheetId

      try {
        const latestReadings = await SheetService.getLatestReadings(sheetId, {
          limit: 6
        })
        this.carousels.latestReadings.items = latestReadings
      } finally {
        this.carousels.latestReadings.loading = false
      }
    },

    async fetchPublishers () {
      this.filters.publishers.loading = true
      this.clearFilterItems('publishers')

      const sheetStore = useSheetStore()
      const sheetId = sheetStore.sheetId

      try {
        const publishers = await SheetService.getPublishers(sheetId)
        this.filters.publishers.items = publishers
      } finally {
        this.filters.publishers.loading = false
      }
    },

    async fetchStores () {
      this.filters.stores.loading = true
      this.clearFilterItems('stores')

      const sheetStore = useSheetStore()
      const sheetId = sheetStore.sheetId

      try {
        const stores = await SheetService.getStores(sheetId)
        this.filters.stores.items = stores
      } finally {
        this.filters.stores.loading = false
      }
    },

    async invalidateAndFetch () {
      this.updateFutureItems('hide')
      this.clearFilterItems('groups', 'publishers', 'stores')

      await this.fetchGroups()
      await this.fetchBooks()
      await this.fetchLastAdded()
      await this.fetchLatestReadings()

      const sheetStore = useSheetStore()
      sheetStore.updateLoading(false)
    },

    updateCurrentPage ({ page, totalResults }) {
      const paginationInfo = buildPaginationInfo({
        perPage: this.perPage,
        links: this.links,
        totalResults,
        page
      })

      this.currentPage = page
      this.paginationInfo = { ...this.paginationInfo, ...paginationInfo }
    },

    /**
     * Update the loading state of a collection.
     *
     * @param {string} key The collection to update
     * @param {boolean} loading The loading value
     */
    updateLoading (key, loading) {
      this[key].loading = loading
    },

    updateFavorites (favorites) {
      this.favorites = favorites
    },

    updateFutureItems (futureItems) {
      this.futureItems = futureItems
    },

    updateGroups (groups) {
      this.filters.groups = { ...this.filters.groups, ...groups }

      if (groups.selected) {
        const { selected } = groups
        const { items: allGroups } = this.filters.groups

        if (selected.length > 0 && selected.length < allGroups.length) {
          localStorage.setItem('collection_groups', JSON.stringify(selected))
        } else if (selected.length === 0 || selected.length === allGroups.length) {
          localStorage.setItem('collection_groups', '[]')
        }
      }
    },

    updateSort ({ sortBy, sortDirection }) {
      this.sortBy = sortBy || this.sortBy
      this.sortDirection = sortDirection || this.sortDirection
    }
  }
})
