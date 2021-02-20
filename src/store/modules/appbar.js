import { bottomNavIsShowing } from '../../util/appbar'

const state = () => ({
  backButton: false,
  bottomActive: true,
  drawer: !bottomNavIsShowing(),
  icons: []
})

const getters = {

}

const actions = {

}

const mutations = {
  hideDrawer: function (state) {
    state.drawer = false
    state.backButton = true
  },

  hideBottomNav: function (state) {
    state.bottomActive = false
  },

  showDrawer: function (state) {
    state.backButton = false

    if (bottomNavIsShowing()) {
      return
    }

    state.drawer = true
  },

  showBottomNav: function (state) {
    state.bottomActive = true
  },

  updateBottomActive: function (state, bottomActive) {
    state.bottomActive = bottomActive
  },

  updateDrawer: function (state, drawer) {
    state.drawer = drawer
  },

  updateIcons: function (state, icons) {
    state.icons = icons
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
