import Paginator from 'paginator'

import SheetService from '@/services/sheet'
import { PropertyToColumn } from '@/model/Book'

import { MutationTypes } from '@/store'

function buildPaginationInfo ({ perPage, links, totalResults, page }) {
  const paginator = new Paginator(perPage, links)

  return paginator.build(totalResults, page)
}

export const CollectionMutations = {
  UPDATE_BOOKS: 'updateBooks',
  UPDATE_CURRENT_PAGE: 'updateCurrentPage',
  UPDATE_FUTURE_ITEMS: 'updateFutureItems',
  UPDATE_GROUPS: 'updateGroups',
  UPDATE_PUBLISHERS: 'updatePublishers',
  UPDATE_LAST_ADDED: 'updateLastAdded',
  UPDATE_LATEST_READINGS: 'updateLatestReadings',
  UPDATE_SORT: 'updateSort',
  UPDATE_STORES: 'updateStores'
}

export const FUTURE_HIDE = 'hide'
export const FUTURE_ONLY = 'only'
export const FUTURE_INDIFERENT = 'indiferent'

const state = () => ({
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
  futureItems: FUTURE_HIDE,
  links: 6,
  paginationInfo: {},
  perPage: 18,
  sortBy: 'createdAt',
  sortDirection: 'desc'
})

const actions = {
  async fetchBooks ({ commit, dispatch, state, rootState }, page) {
    commit(CollectionMutations.UPDATE_BOOKS, { loading: true })

    page = page || state.currentPage
    const sheetId = rootState.sheet.sheetId

    try {
      if (state.filters.groups.items.length === 0) {
        await dispatch('fetchGroups')
      }

      let groups = state.filters.groups.selected
      const allGroups = state.filters.groups.items.map(grp => grp.name)
      const groupData = groups.filter(grp => allGroups.includes(grp))

      if (groupData.length === 0) {
        groups = allGroups
      } else if (groupData.length < allGroups.length) {
        groups = groupData
      }

      const orderBy = PropertyToColumn[state.sortBy]
      const orderDirection = state.sortDirection
      const futureItems = state.futureItems

      const { books, totalResults } = await SheetService.getBooks(sheetId, page, {
        futureItems,
        groups,
        orderBy,
        orderDirection
      })
      commit(CollectionMutations.UPDATE_BOOKS, { items: books })
      commit(CollectionMutations.UPDATE_CURRENT_PAGE, { page, totalResults })
      commit(CollectionMutations.UPDATE_GROUPS, { selected: groups })
    } finally {
      commit(CollectionMutations.UPDATE_BOOKS, { loading: false })
    }
  },

  async fetchGroups ({ commit, rootState }) {
    commit(CollectionMutations.UPDATE_GROUPS, { loading: true, items: [] })

    const sheetId = rootState.sheet.sheetId

    try {
      const groups = await SheetService.getGroups(sheetId)
      commit(CollectionMutations.UPDATE_GROUPS, { items: groups })
    } finally {
      commit(CollectionMutations.UPDATE_GROUPS, { loading: false })
    }
  },

  async fetchPublishers ({ commit, rootState }) {
    commit(CollectionMutations.UPDATE_PUBLISHERS, { loading: true, items: [] })

    const sheetId = rootState.sheet.sheetId

    try {
      const publishers = await SheetService.getPublishers(sheetId)
      commit(CollectionMutations.UPDATE_PUBLISHERS, { items: publishers })
    } finally {
      commit(CollectionMutations.UPDATE_PUBLISHERS, { loading: false })
    }
  },

  async fetchLastAdded ({ commit, dispatch, state, rootState }) {
    commit(CollectionMutations.UPDATE_LAST_ADDED, { loading: true, items: [] })

    const sheetId = rootState.sheet.sheetId

    try {
      const lastAdded = await SheetService.getBooks(sheetId, 1, {
        limit: 6,
        dontCount: true
      })
      commit(CollectionMutations.UPDATE_LAST_ADDED, { items: lastAdded.books })
    } finally {
      commit(CollectionMutations.UPDATE_LAST_ADDED, { loading: false })
    }
  },

  async fetchLatestReadings ({ commit, dispatch, state, rootState }) {
    commit(CollectionMutations.UPDATE_LATEST_READINGS, { loading: true, items: [] })

    const sheetId = rootState.sheet.sheetId

    try {
      const latestReadings = await SheetService.getLatestReadings(sheetId, {
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
      const stores = await SheetService.getStores(sheetId)
      commit(CollectionMutations.UPDATE_STORES, { items: stores })
    } finally {
      commit(CollectionMutations.UPDATE_STORES, { loading: false })
    }
  },

  async invalidateAndFetch ({ commit, dispatch }) {
    commit(CollectionMutations.UPDATE_FUTURE_ITEMS, 'hide')
    commit(CollectionMutations.UPDATE_GROUPS, { items: [], selected: [] })
    commit(CollectionMutations.UPDATE_PUBLISHERS, { items: [] })
    commit(CollectionMutations.UPDATE_STORES, { items: [] })

    await dispatch('fetchGroups')
    await dispatch('fetchBooks')
    await dispatch('fetchLastAdded')
    await dispatch('fetchLatestReadings')

    commit(MutationTypes.SHEET_UPDATE_LOADING, false, { root: true })
  }
}

const mutations = {
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

  [CollectionMutations.UPDATE_FUTURE_ITEMS]: function (state, futureItems) {
    state.futureItems = futureItems
  },

  [CollectionMutations.UPDATE_GROUPS]: function (state, groups) {
    state.filters.groups = { ...state.filters.groups, ...groups }

    if (groups.selected) {
      const { selected } = groups
      const { items: allGroups } = state.filters.groups

      if (selected.length > 0 && selected.length < allGroups.length) {
        localStorage.setItem('collection_groups', JSON.stringify(selected))
      } else if (selected.length === 0 || selected.length === allGroups.length) {
        localStorage.setItem('collection_groups', '[]')
      }
    }
  },

  [CollectionMutations.UPDATE_PUBLISHERS]: function (state, publishers) {
    state.filters.publishers = { ...state.filters.publishers, ...publishers }
  },

  [CollectionMutations.UPDATE_LAST_ADDED]: function (state, lastAdded) {
    state.carousels.lastAdded = { ...state.carousels.lastAdded, ...lastAdded }
  },

  [CollectionMutations.UPDATE_LATEST_READINGS]: function (state, latestReadings) {
    state.carousels.latestReadings = { ...state.carousels.latestReadings, ...latestReadings }
  },

  [CollectionMutations.UPDATE_SORT]: function (state, { sortBy, sortDirection }) {
    state.sortBy = sortBy
    state.sortDirection = sortDirection
  },

  [CollectionMutations.UPDATE_STORES]: function (state, stores) {
    state.filters.stores = { ...state.filters.stores, ...stores }
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
