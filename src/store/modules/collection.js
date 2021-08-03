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
    updateBooks: function (state, books) {
      state.books = { ...state.books, ...books }
    },

    updateCurrentPage: function (state, { page, totalResults }) {
      const paginationInfo = buildPaginationInfo({
        perPage: state.perPage,
        links: state.links,
        totalResults,
        page
      })

      state.currentPage = page
      state.paginationInfo = { ...state.paginationInfo, ...paginationInfo }
    },

    updateGridMode: function (state, gridMode) {
      state.gridMode = gridMode
      localStorage.setItem('grid_mode', gridMode)
    },

    updateGroup: function (state, { group, totalResults }) {
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

    updateGroups: function (state, groups) {
      state.groups = { ...state.groups, ...groups }
    },

    updateIdMap: function (state, idMap) {
      state.idMap = {}
      state.idMap = { ...state.idMap, ...idMap }
    },

    updateImprints: function (state, imprints) {
      state.imprints = { ...state.imprints, ...imprints }
    },

    updateLastAdded: function (state, lastAdded) {
      state.lastAdded = { ...state.lastAdded, ...lastAdded }
    },

    updateLatestReadings: function (state, latestReadings) {
      state.latestReadings = { ...state.latestReadings, ...latestReadings }
    },

    updateSearch: function (state, search) {
      state.search = { ...state.search, ...search }
    },

    updateSort: function (state, { sortBy, sortDirection }) {
      state.sortBy = sortBy
      state.sortDirection = sortDirection
    },

    updateStores: function (state, stores) {
      state.stores = { ...state.stores, ...stores }
    },

    updateViewMode: function (state, viewMode) {
      state.viewMode = viewMode
      localStorage.setItem('view_mode', viewMode)
    }
  },
  actions: {
    async fetchBooks ({ commit, dispatch, state, rootState }, page) {
      commit('updateBooks', { loading: true })

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
        commit('updateBooks', { items: books })
        commit('updateCurrentPage', { page, totalResults })
        commit('updateGroup', { group })
      } finally {
        commit('updateBooks', { loading: false })
      }
    },

    async fetchGroups ({ commit, rootState }) {
      commit('updateGroups', { loading: true, items: [] })

      const sheetId = rootState.sheet.sheetId

      try {
        const groups = await getGroups(sheetId)
        commit('updateGroups', { items: groups })
      } finally {
        commit('updateGroups', { loading: false })
      }
    },

    async fetchIdMap ({ commit, rootState }) {
      const sheetId = rootState.sheet.sheetId

      try {
        const idMap = await getBookIds(sheetId)
        commit('updateIdMap', idMap)
      } catch (e) {
        commit('updateIdMap', {})
      }
    },

    async fetchImprints ({ commit, rootState }) {
      commit('updateImprints', { loading: true, items: [] })

      const sheetId = rootState.sheet.sheetId

      try {
        const imprints = await getImprints(sheetId)
        commit('updateImprints', { items: imprints })
      } finally {
        commit('updateImprints', { loading: false })
      }
    },

    async fetchLastAdded ({ commit, dispatch, state, rootState }) {
      commit('updateLastAdded', { loading: true, items: [] })

      const sheetId = rootState.sheet.sheetId

      try {
        if (Object.keys(state.idMap).length === 0) {
          await dispatch('fetchIdMap')
        }

        const lastAdded = await getBooks(sheetId, state.idMap, 1, { limit: 6 })
        commit('updateLastAdded', { items: lastAdded })
      } finally {
        commit('updateLastAdded', { loading: false })
      }
    },

    async fetchLatestReadings ({ commit, dispatch, state, rootState }) {
      commit('updateLatestReadings', { loading: true, items: [] })

      const sheetId = rootState.sheet.sheetId

      try {
        if (Object.keys(state.idMap).length === 0) {
          await dispatch('fetchIdMap')
        }

        const latestReadings = await getLatestReadings(sheetId, state.idMap, {
          limit: 6
        })
        commit('updateLatestReadings', { items: latestReadings })
      } finally {
        commit('updateLatestReadings', { loading: false })
      }
    },

    async fetchStores ({ commit, rootState }) {
      commit('updateStores', { loading: true, items: [] })

      const sheetId = rootState.sheet.sheetId

      try {
        const stores = await getStores(sheetId)
        commit('updateStores', { items: stores })
      } finally {
        commit('updateStores', { loading: false })
      }
    },

    async search ({ commit, dispatch, state, rootState }, { query }) {
      commit('updateSearch', { loading: true, results: [], query })

      const sheetId = rootState.sheet.sheetId

      try {
        if (Object.keys(state.idMap).length === 0) {
          await dispatch('fetchIdMap')
        }

        const results = await searchBooks(sheetId, state.idMap, query)
        commit('updateSearch', { results })
      } catch (e) {
        commit('updateSearch', { results: [] })
      } finally {
        commit('updateSearch', { loading: false })
      }
    }
  }
}
