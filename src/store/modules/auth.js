export default {
  namespaced: true,
  state: () => ({
    discoveryDocs: [
      'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
      'https://sheets.googleapis.com/$discovery/rest?version=v4'
    ],
    scopes: 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.metadata.readonly',
    started: false,
    signedIn: false,
    profileName: undefined,
    profileEmail: undefined,
    profileImageUrl: undefined
  }),
  getters: {
    isSignedIn: state => state.signedIn,
    isStarted: state => state.started
  },
  actions: {
    initApp: function ({ commit, state }) {
      return new Promise((resolve, reject) => {
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

              const signedIn = window.gapi.auth2.getAuthInstance().isSignedIn.get()

              commit('updateStarted', true)
              commit('updateSignedIn', signedIn)

              resolve(signedIn)
            }, () => reject(new Error('Não foi possível inicializar.')))
        })
      })
    },
    signIn: function () {
      return window.gapi.auth2.getAuthInstance().signIn()
    },
    signOut: function () {
      return window.gapi.auth2.getAuthInstance().signOut()
    }
  },
  mutations: {
    updateSignedIn: function (state, signedIn) {
      state.signedIn = signedIn

      if (signedIn) {
        const profile = window.gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile()

        state.profileName = profile.getName()
        state.profileEmail = profile.getEmail()
        state.profileImageUrl = profile.getImageUrl()
      } else {
        state.profileName = undefined
        state.profileEmail = undefined
        state.profileImageUrl = undefined
      }
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
}
