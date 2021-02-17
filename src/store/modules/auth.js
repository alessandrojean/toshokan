const state = () => ({
  discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
  scopes: 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.metadata.readonly',
  started: false,
  signedIn: false,
  profileName: undefined,
  profileEmail: undefined,
  profileImageUrl: undefined
})

const getters = {
  isSignedIn: state => state.signedIn
}

const actions = {
  initApp: function ({ commit, state }) {
    window.gapi.load('client:auth2', () => {
      window.gapi.client
        .init({
          discoveryDocs: state.discoveryDocs,
          clientId: process.env.VUE_APP_CLIENT_ID,
          scope: state.scopes
        })
        .then(() => {
          window.gapi.auth2
            .getAuthInstance()
            .isSignedIn
            .listen(signedIn => commit('updateSignedIn', signedIn))

          commit('updateStarted', true)
          commit('updateSignedIn', window.gapi.auth2.getAuthInstance().isSignedIn.get())
        })
    })
  },
  signIn: function ({ commit }) {
    window.gapi.auth2.getAuthInstance().signIn()
      .then(() => {
        const profile = window.gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile()

        commit('updateProfileName', profile.getName())
        commit('updateProfileEmail', profile.getEmail())
        commit('updateProfileImageUrl', profile.getImageUrl())
      })
  },
  signOut: function ({ commit }) {
    window.gapi.auth2.getAuthInstance().signOut()
      .then(() => {
        commit('updateProfileName', undefined)
        commit('updateProfileEmail', undefined)
        commit('updateProfileImageUrl', undefined)
      })
  }
}

const mutations = {
  updateSignedIn: function (state, signedIn) {
    state.signedIn = signedIn
  },
  updateStarted: function (state, started) {
    state.started = started
  },
  updateProfileName: function (state, name) {
    state.profileName = name
  },
  updateProfileEmail: function (state, email) {
    state.profileEmail = email
  },
  updateProfileImageUrl: function (state, imageUrl) {
    state.profileImageUrl = imageUrl
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
