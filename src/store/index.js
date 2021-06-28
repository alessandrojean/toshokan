import { createStore } from 'vuex'

import auth from './modules/auth'
import collection from './modules/collection'
import sheet from './modules/sheet'

export default createStore({
  state: {
    criticalError: null
  },
  getters: {
    hasCriticalError (state) {
      return state.criticalError !== null
    }
  },
  mutations: {
    clearCriticalError (state) {
      state.criticalError = null
    },
    updateCriticalError (state, error) {
      state.criticalError = error
    }
  },
  actions: {
  },
  modules: {
    auth,
    collection,
    sheet
  }
})
