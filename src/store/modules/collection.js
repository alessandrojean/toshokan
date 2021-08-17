import Paginator from 'paginator'

import {
  getBookIds,
  getBooks,
  getBooksFromGroup,
  getGroups,
  getImprints,
  getLatestReadings,
  getStores,
  searchBooks
} from '@/services/sheet'
import { PropertyToColumn } from '@/model/Book'

function buildPaginationInfo ({ perPage, links, totalResults, page }) {
  const paginator = new Paginator(perPage, links)

  return paginator.build(totalResults, page)
}

export const CollectionMutations = {
  UPDATE_BOOKS: 'updateBooks',
  UPDATE_CURRENT_PAGE: 'updateCurrentPage',
  UPDATE_GRID_MODE: 'updateGridMode',
  UPDATE_GROUP: 'updateGroup',
  UPDATE_GROUPS: 'updateGroups',
  UPDATE_ID_MAP: 'updateIdMap',
  UPDATE_IMPRINTS: 'updateImprints',
  UPDATE_LAST_ADDED: 'updateLastAdded',
  UPDATE_LATEST_READINGS: 'updateLatestReadings',
  UPDATE_SEARCH: 'updateSearch',
  UPDATE_SORT: 'updateSort',
  UPDATE_STORES: 'updateStores',
  UPDATE_VIEW_MODE: 'updateViewMode'
}

export default {
  namespaced: true,
  state: {
    books: {
      items: [],
      loading: false
    },
    currentPage: 1,
    gridMode: localStorage.getItem('grid_mode') || 'compact',
    group: localStorage.getItem('collection_group'),
    groups: {
      items: [],
      loading: false
    },
    idMap: {},
    imprints: {
      items: [],
      loading: false
    },
    lastAdded: {
      items: [],
      loading: false
    },
    latestReadings: {
      items: [],
      loading: false
    },
    links: 6,
    paginationInfo: {},
    perPage: 18,
    search: {
      query: '',
      results: [],
      loading: false
    },
    stores: {
      items: [],
      loading: false
    },
    sortBy: 'createdAt',
    sortDirection: 'desc',
    viewMode: localStorage.getItem('view_mode') || 'table'
  },
  mutations: {
    [CollectionMutations.UPDATE_BOOKS]: function (state, books) {
      state.books = { ...state.books, ...books }
    },

    [CollectionMutations.UPDATE_CURRENT_PAGE]: function (state, { page, totalResults }) {
      const paginationInfo = buildPaginationInfo({
        perPage: state.perPage,
        links: state.links,
        totalResults,
        page
      })

      state.currentPage = page
      state.paginationInfo = { ...state.paginationInfo, ...paginationInfo }
    },

    [CollectionMutations.UPDATE_GRID_MODE]: function (state, gridMode) {
      state.gridMode = gridMode
      localStorage.setItem('grid_mode', gridMode)
    },

    [CollectionMutations.UPDATE_GROUP]: function (state, { group, totalResults }) {
      state.group = group || ''
      localStorage.setItem('collection_group', group)

      if (totalResults) {
        const paginationInfo = buildPaginationInfo({
          perPage: state.perPage,
          links: state.links,
          totalResults,
          page: state.currentPage === 0 ? 1 : state.currentPage
        })

        state.currentPage = state.currentPage === 0 ? 1 : state.currentPage
        state.paginationInfo = { ...state.paginationInfo, ...paginationInfo }
      }
    },

    [CollectionMutations.UPDATE_GROUPS]: function (state, groups) {
      state.groups = { ...state.groups, ...groups }
    },

    [CollectionMutations.UPDATE_ID_MAP]: function (state, idMap) {
      state.idMap = {}
      state.idMap = { ...state.idMap, ...idMap }
    },

    [CollectionMutations.UPDATE_IMPRINTS]: function (state, imprints) {
      state.imprints = { ...state.imprints, ...imprints }
    },

    [CollectionMutations.UPDATE_LAST_ADDED]: function (state, lastAdded) {
      state.lastAdded = { ...state.lastAdded, ...lastAdded }
    },

    [CollectionMutations.UPDATE_LATEST_READINGS]: function (state, latestReadings) {
      state.latestReadings = { ...state.latestReadings, ...latestReadings }
    },

    [CollectionMutations.UPDATE_SEARCH]: function (state, search) {
      state.search = { ...state.search, ...search }
    },

    [CollectionMutations.UPDATE_SORT]: function (state, { sortBy, sortDirection }) {
      state.sortBy = sortBy
      state.sortDirection = sortDirection
    },

    [CollectionMutations.UPDATE_STORES]: function (state, stores) {
      state.stores = { ...state.stores, ...stores }
    },

    [CollectionMutations.UPDATE_VIEW_MODE]: function (state, viewMode) {
      state.viewMode = viewMode
      localStorage.setItem('view_mode', viewMode)
    }
  },
  actions: {
    async fetchBooks ({ commit, dispatch, state, rootState }, page) {
      commit(CollectionMutations.UPDATE_BOOKS, { loading: true })

      const sheetId = rootState.sheet.sheetId

      try {
        if (state.groups.items.length === 0) {
          await dispatch('fetchGroups')
        }

        if (Object.keys(state.idMap).length === 0) {
          await dispatch('fetchIdMap')
        }

        let group = state.group
        const groupData = state.groups.items.find(grp => grp.name === group)

        if (!groupData && state.groups.items.length > 0) {
          group = state.groups.items[0].name
        }

        const orderBy = PropertyToColumn[state.sortBy]
        const orderDirection = state.sortDirection

        const { books, totalResults } = await getBooksFromGroup(
          sheetId, state.idMap, group, page,
          { orderBy, orderDirection }
        )
        commit(CollectionMutations.UPDATE_BOOKS, { items: books })
        commit(CollectionMutations.UPDATE_CURRENT_PAGE, { page, totalResults })
        commit(CollectionMutations.UPDATE_GROUP, { group })
      } finally {
        commit(CollectionMutations.UPDATE_BOOKS, { loading: false })
      }
    },

    async fetchGroups ({ commit, rootState }) {
      commit(CollectionMutations.UPDATE_GROUPS, { loading: true, items: [] })

      const sheetId = rootState.sheet.sheetId

      try {
        const groups = await getGroups(sheetId)
        commit(CollectionMutations.UPDATE_GROUPS, { items: groups })
      } finally {
        commit(CollectionMutations.UPDATE_GROUPS, { loading: false })
      }
    },

    async fetchIdMap ({ commit, rootState }) {
      const sheetId = rootState.sheet.sheetId

      try {
        const idMap = await getBookIds(sheetId)
        commit(CollectionMutations.UPDATE_ID_MAP, idMap)
      } catch (e) {
        commit(CollectionMutations.UPDATE_ID_MAP, {})
      }
    },

    async fetchImprints ({ commit, rootState }) {
      commit(CollectionMutations.UPDATE_IMPRINTS, { loading: true, items: [] })

      const sheetId = rootState.sheet.sheetId

      try {
        const imprints = await getImprints(sheetId)
        commit(CollectionMutations.UPDATE_IMPRINTS, { items: imprints })
      } finally {
        commit(CollectionMutations.UPDATE_IMPRINTS, { loading: false })
      }
    },

    async fetchLastAdded ({ commit, dispatch, state, rootState }) {
      commit(CollectionMutations.UPDATE_LAST_ADDED, { loading: true, items: [] })

      const sheetId = rootState.sheet.sheetId

      try {
        if (Object.keys(state.idMap).length === 0) {
          await dispatch('fetchIdMap')
        }

        const lastAdded = await getBooks(sheetId, state.idMap, 1, { limit: 6 })
        commit(CollectionMutations.UPDATE_LAST_ADDED, { items: lastAdded })
      } finally {
        commit(CollectionMutations.UPDATE_LAST_ADDED, { loading: false })
      }
    },

    async fetchLatestReadings ({ commit, dispatch, state, rootState }) {
      commit(CollectionMutations.UPDATE_LATEST_READINGS, { loading: true, items: [] })

      const sheetId = rootState.sheet.sheetId

      try {
        if (Object.keys(state.idMap).length === 0) {
          await dispatch('fetchIdMap')
        }

        const latestReadings = await getLatestReadings(sheetId, state.idMap, {
          limit: 6
        })
        commit(CollectionMutations.UPDATE_LATEST_READINGS, { items: latestReadings })
      } finally {
        commit(CollectionMutations.UPDATE_LATEST_READINGS, { loading: false })
      }
    },

    async fetchStores ({ commit, rootState }) {
      commit(CollectionMutations.UPDATE_STORES, { loading: true, items: [] })

      const sheetId = rootState.sheet.sheetId

      try {
        const stores = await getStores(sheetId)
        commit(CollectionMutations.UPDATE_STORES, { items: stores })
      } finally {
        commit(CollectionMutations.UPDATE_STORES, { loading: false })
      }
    },

    async search ({ commit, dispatch, state, rootState }, { query }) {
      commit(CollectionMutations.UPDATE_SEARCH, { loading: true, results: [], query })

      const sheetId = rootState.sheet.sheetId

      try {
        if (Object.keys(state.idMap).length === 0) {
          await dispatch('fetchIdMap')
        }

        const results = await searchBooks(sheetId, state.idMap, query)
        commit(CollectionMutations.UPDATE_SEARCH, { results })
      } catch (e) {
        commit(CollectionMutations.UPDATE_SEARCH, { results: [] })
      } finally {
        commit(CollectionMutations.UPDATE_SEARCH, { loading: false })
      }
    }
  }
}
