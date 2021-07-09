import { findSheetId, getSheetData } from '@/services/sheet'
import { bookCompare } from '@/model/Book'

const state = () => ({
  collection: {},
  current: '',
  display: (localStorage && localStorage.getItem('DISPLAY_MODE')) || 'grid',
  lastAdded: [],
  loadedOnce: false,
  loading: true,
  sheetId: undefined,
  imprints: [],
  stores: [],
  stats: {},
  timeZone: {
    name: 'America/Sao_Paulo',
    offset: -3,
    offsetStr: '-03:00'
  }
})

const getters = {
  collections: function (state) {
    return Object.keys(state.collection).sort()
  },
  getCollectionByName: function (state) {
    return function (name) {
      return state.collections[name]
    }
  },
  sheetIsEmpty: function (state) {
    return state.stats.count === 0
  }
}

const actions = {
  findSheetId: async function ({ commit }) {
    const sheetId = await findSheetId()

    commit('updateSheetId', sheetId)

    return sheetId
  },

  loadSheetData: async function ({ commit, dispatch, state }) {
    commit('updateLoading', true)

    let sheetId = state.sheetId

    if (!sheetId) {
      sheetId = await dispatch('findSheetId')
    }

    const sheetData = await getSheetData(sheetId)

    commit('updateLastAdded', sheetData.lastAdded)
    commit('updateCollection', sheetData.collection)
    commit('updateImprints', sheetData.imprints)
    commit('updateStores', sheetData.stores)
    commit('updateStats', sheetData.stats)
    commit('updateTimeZone', sheetData.timeZone)

    commit('updateLoading', false)

    let group = localStorage.getItem('collection_group')
    let groupItems = sheetData.collection[group]

    if (!group || !groupItems) {
      group = Object.keys(sheetData.collection)[0] || ''
      groupItems = sheetData.collection[group] || []
    }

    commit(
      'collection/updateGroup',
      {
        group,
        totalResults: groupItems.length
      },
      { root: true }
    )
  }
}

const mutations = {
  updateBook: function (state, { book, oldBook }) {
    const index = state.collection[oldBook.collection]
      .findIndex(b => b.sheetLocation === oldBook.sheetLocation)

    if (book.collection === oldBook.collection) {
      state.collection[book.collection][index] = book
    } else {
      state.collection[book.collection].splice(index, 1)

      if (state.collection[book.collection]) {
        state.collection[book.collection].push(book)
      } else {
        state.collection = {
          ...state.collection,
          [book.collection]: [book]
        }
      }
    }

    state.collection[book.collection].sort(bookCompare)
  },
  updateCollection: function (state, collection) {
    state.collection = { ...state.collection, ...collection }

    const collections = Object.keys(collection).sort()

    if (state.current === '' || !collection[state.current]) {
      state.current = collections[0]
    }
  },
  updateLastAdded: function (state, lastAdded) {
    state.lastAdded = lastAdded
  },
  updateCurrent: function (state, current) {
    state.current = current
  },
  updateDisplay: function (state, display) {
    state.display = display
    localStorage && localStorage.setItem('DISPLAY_MODE', display)
  },
  updateLoading: function (state, loading) {
    state.loading = loading
    state.loadedOnce = true
  },
  updateSheetId: function (state, sheetId) {
    state.sheetId = sheetId
  },
  updateImprints: function (state, imprints) {
    state.imprints = imprints
  },
  updateStores: function (state, stores) {
    state.stores = stores
  },
  updateStats: function (state, stats) {
    state.stats = { ...state.stats, ...stats }
  },
  updateTimeZone: function (state, timeZone) {
    state.timeZone = { ...state.timeZone, ...timeZone }
  },
  resetLoadedOnce: function (state) {
    state.loadedOnce = false
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
