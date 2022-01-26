import { findSheetId, getSheetData } from '@/services/sheet'

export const SheetMutations = {
  UPDATE_LOADING: 'updateLoading',
  UPDATE_OPTIONS: 'updateOptions',
  UPDATE_SELECTED: 'updateSelected',
  UPDATE_SHEET_ID: 'updateSheetId',
  UPDATE_STATS: 'updateStats',
  UPDATE_TIMEZONE: 'updateTimeZone',
  RESET_LOADED_ONCE: 'resetLoadedOnce'
}

const state = () => ({
  loadedOnce: false,
  loading: true,
  options: [],
  selected: null,
  sheetId: undefined,
  stats: {},
  timeZone: {
    name: 'America/Sao_Paulo',
    offset: -3,
    offsetStr: '-03:00',
    timezoneOffset: 180
  }
})

const getters = {
  canChange: (state) => {
    return state.options.length > 1
  },

  canEdit: (state) => {
    return state.selected && state.selected.capabilities.canEdit
  },

  ownerDisplayName: (state) => {
    return state.selected
      ? state.selected.owners[0].displayName
      : null
  },

  ownerPictureUrl: (state) => {
    return state.selected
      ? state.selected.owners[0].photoLink
      : null
  },

  shared: (state) => {
    return state.selected && state.selected.ownedByMe === false
  },

  sheetIsEmpty: function (state) {
    return state.stats.count === 0
  }
}

const actions = {
  findSheetId: async function ({ commit }) {
    const { sheet, options } = await findSheetId()

    commit(SheetMutations.UPDATE_SHEET_ID, sheet.id)
    commit(SheetMutations.UPDATE_SELECTED, sheet)
    commit(SheetMutations.UPDATE_OPTIONS, options)

    return sheet.id
  },

  loadSheetData: async function ({ commit, dispatch, state }, persistLoading) {
    commit(SheetMutations.UPDATE_LOADING, true)

    let sheetId = state.sheetId

    if (!sheetId) {
      sheetId = await dispatch('findSheetId')
    }

    const sheetData = await getSheetData(sheetId)

    commit(SheetMutations.UPDATE_STATS, sheetData.stats)
    commit(SheetMutations.UPDATE_TIMEZONE, sheetData.timeZone)

    if (!persistLoading) {
      commit(SheetMutations.UPDATE_LOADING, false)
    }
  }
}

const mutations = {
  [SheetMutations.UPDATE_LOADING]: function (state, loading) {
    state.loading = loading
    state.loadedOnce = true
  },

  [SheetMutations.UPDATE_OPTIONS]: function (state, options) {
    state.options = options ? options.slice() : []
  },

  [SheetMutations.UPDATE_SELECTED]: function (state, sheet) {
    state.selected = sheet ? { ...state.selected, ...sheet } : null
  },

  [SheetMutations.UPDATE_SHEET_ID]: function (state, sheetId) {
    state.sheetId = sheetId
    localStorage.setItem('last_sheet_opened', sheetId)
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

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
