import Paginator from 'paginator'

import {
  getBookIds,
  getBooks,
  getBooksFromGroup,
  getGroups,
  getPublishers,
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
  CLEAR_SEARCH: 'clearSearch',
  UPDATE_BOOKS: 'updateBooks',
  UPDATE_CURRENT_PAGE: 'updateCurrentPage',
  UPDATE_GRID_MODE: 'updateGridMode',
  UPDATE_GROUP: 'updateGroup',
  UPDATE_GROUPS: 'updateGroups',
  UPDATE_ID_MAP: 'updateIdMap',
  UPDATE_PUBLISHERS: 'updatePublishers',
  UPDATE_LAST_ADDED: 'updateLastAdded',
  UPDATE_LATEST_READINGS: 'updateLatestReadings',
  UPDATE_SEARCH: 'updateSearch',
  UPDATE_SORT: 'updateSort',
  UPDATE_SPOILER_MODE: 'updateSpoilerMode',
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
    gridMode: localStorage.getItem('grid_mode') || 'comfortable',
    group: localStorage.getItem('collection_group'),
    groups: {
      items: [],
      loading: false
    },
    idMap: {},
    publishers: {
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
      history: localStorage.getItem('search_history')
        ? JSON.parse(localStorage.getItem('search_history'))
        : [],
      query: '',
      sortBy: 'createdAt',
      sortDirection: 'desc',
      results: [],
      loading: false
    },
    stores: {
      items: [],
      loading: false
    },
    sortBy: 'createdAt',
    sortDirection: 'desc',
    spoilerMode: {
      synopsis: localStorage.getItem('spoiler_mode_synopsis') === 'true',
      cover: localStorage.getItem('spoiler_mode_cover') === 'true'
    },
    viewMode: localStorage.getItem('view_mode') || 'grid'
  },
  mutations: {
    [CollectionMutations.CLEAR_SEARCH]: function (state) {
      state.search = {
        ...state.search,
        query: '',
        sortBy: 'createdAt',
        sortDirection: 'desc',
        results: [],
        loading: false
      }
    },

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

    [CollectionMutations.UPDATE_PUBLISHERS]: function (state, publishers) {
      state.publishers = { ...state.publishers, ...publishers }
    },

    [CollectionMutations.UPDATE_LAST_ADDED]: function (state, lastAdded) {
      state.lastAdded = { ...state.lastAdded, ...lastAdded }
    },

    [CollectionMutations.UPDATE_LATEST_READINGS]: function (state, latestReadings) {
      state.latestReadings = { ...state.latestReadings, ...latestReadings }
    },

    [CollectionMutations.UPDATE_SEARCH]: function (state, search) {
      state.search = { ...state.search, ...search }

      if (search.history) {
        localStorage.setItem('search_history', JSON.stringify(search.history))
      }
    },

    [CollectionMutations.UPDATE_SORT]: function (state, { sortBy, sortDirection }) {
      state.sortBy = sortBy
      state.sortDirection = sortDirection
    },

    [CollectionMutations.UPDATE_SPOILER_MODE]: function (state, spoilerMode) {
      state.spoilerMode = { ...state.spoilerMode, ...spoilerMode }
      localStorage.setItem('spoiler_mode_synopsis', spoilerMode.synopsis)
      localStorage.setItem('spoiler_mode_cover', spoilerMode.cover)
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

      page = page || state.currentPage
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

    async fetchPublishers ({ commit, rootState }) {
      commit(CollectionMutations.UPDATE_PUBLISHERS, { loading: true, items: [] })

      const sheetId = rootState.sheet.sheetId

      try {
        const publishers = await getPublishers(sheetId)
        commit(CollectionMutations.UPDATE_PUBLISHERS, { items: publishers })
      } finally {
        commit(CollectionMutations.UPDATE_PUBLISHERS, { loading: false })
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

    async search ({ commit, dispatch, state, rootState }, { query, sortBy, sortDirection }) {
      commit(CollectionMutations.UPDATE_SEARCH, { loading: true, results: [], query })

      const sheetId = rootState.sheet.sheetId

      try {
        if (Object.keys(state.idMap).length === 0) {
          await dispatch('fetchIdMap')
        }

        commit(CollectionMutations.UPDATE_SEARCH, {
          sortBy: sortBy || state.search.sortBy,
          sortDirection: sortDirection || state.search.sortDirection
        })

        const results = await searchBooks(
          sheetId,
          state.idMap,
          query,
          {
            sortBy: state.search.sortBy,
            sortDirection: state.search.sortDirection
          }
        )

        const newHistory = [query].concat(state.search.history)

        commit(CollectionMutations.UPDATE_SEARCH, {
          results,
          history: [...new Set(newHistory)].slice(0, 6)
        })
      } catch (e) {
        commit(CollectionMutations.UPDATE_SEARCH, { results: [] })
      } finally {
        commit(CollectionMutations.UPDATE_SEARCH, { loading: false })
      }
    }
  }
}
