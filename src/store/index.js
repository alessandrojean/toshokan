import Vue from 'vue'
import Vuex from 'vuex'

import auth from './modules/auth'
import sheet from './modules/sheet'
import appbar from './modules/appbar'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    sheet,
    appbar
  }
})
