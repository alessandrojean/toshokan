import { createStore } from 'vuex'

import auth from './modules/auth'
import collection from './modules/collection'
import sheet from './modules/sheet'

export default createStore({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    auth,
    collection,
    sheet
  }
})
