import { findSheetId, getSheetData } from '@/services/sheet'

export const SheetMutations = {
  UPDATE_LOADING: 'updateLoading',
  UPDATE_SHEET_ID: 'updateSheetId',
  UPDATE_STATS: 'updateStats',
  UPDATE_TIMEZONE: 'updateTimeZone',
  RESET_LOADED_ONCE: 'resetLoadedOnce'
}

export default {
  namespaced: true,
  state: {
    loadedOnce: false,
    loading: true,
    sheetId: undefined,
    stats: {},
    timeZone: {
      name: 'America/Sao_Paulo',
      offset: -3,
      offsetStr: '-03:00'
    }
  },
  getters: {
    sheetIsEmpty: function (state) {
      return state.stats.count === 0
    }
  },
  actions: {
    findSheetId: async function ({ commit }) {
      const sheetId = await findSheetId()

      commit(SheetMutations.UPDATE_SHEET_ID, sheetId)

      return sheetId
    },

    loadSheetData: async function ({ commit, dispatch, state }) {
      commit(SheetMutations.UPDATE_LOADING, true)

      let sheetId = state.sheetId

      if (!sheetId) {
        sheetId = await dispatch('findSheetId')
      }

      const sheetData = await getSheetData(sheetId)

      commit(SheetMutations.UPDATE_STATS, sheetData.stats)
      commit(SheetMutations.UPDATE_TIMEZONE, sheetData.timeZone)

      commit(SheetMutations.UPDATE_LOADING, false)
    }
  },
  mutations: {
    [SheetMutations.UPDATE_LOADING]: function (state, loading) {
      state.loading = loading
      state.loadedOnce = true
    },

    [SheetMutations.UPDATE_SHEET_ID]: function (state, sheetId) {
      state.sheetId = sheetId
    },

    [SheetMutations.UPDATE_STATS]: function (state, stats) {
      state.stats = { ...state.stats, ...stats }
    },

    [SheetMutations.UPDATE_TIMEZONE]: function (state, timeZone) {
      state.timeZone = { ...state.timeZone, ...timeZone }
    },

    [SheetMutations.RESET_LOADED_ONCE]: function (state) {
      state.loadedOnce = false
    }
  }
}
