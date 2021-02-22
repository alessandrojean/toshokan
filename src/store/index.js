import Vue from 'vue'
import Vuex from 'vuex'

import auth from './modules/auth'
import sheet from './modules/sheet'
import appbar from './modules/appbar'
import book from './modules/book'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    sheet,
    appbar,
    book
  }
})
