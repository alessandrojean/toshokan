const state = () => ({
  backButton: false,
  drawer: true,
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

  showDrawer: function (state) {
    state.drawer = true
    state.backButton = false
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
