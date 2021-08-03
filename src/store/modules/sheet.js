import { findSheetId, getSheetData } from '@/services/sheet'
import { bookCompare } from '@/model/Book'

const state = () => ({
  loadedOnce: false,
  loading: true,
  sheetId: undefined,
  stats: {},
  timeZone: {
    name: 'America/Sao_Paulo',
    offset: -3,
    offsetStr: '-03:00'
  }
})

const getters = {
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

    commit('updateStats', sheetData.stats)
    commit('updateTimeZone', sheetData.timeZone)

    commit('updateLoading', false)
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
  updateLoading: function (state, loading) {
    state.loading = loading
    state.loadedOnce = true
  },
  updateSheetId: function (state, sheetId) {
    state.sheetId = sheetId
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
