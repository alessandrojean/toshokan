export const AuthMutations = {
  UPDATE_SIGNED_IN: 'updateSignedIn',
  UPDATE_STARTED: 'updateStarted',
  UPDATE_PROFILE_NAME: 'updateProfileName',
  UPDATE_PROFILE_EMAIL: 'updateProfileEmail',
  UPDATE_PROFILE_IMAGE_URL: 'updateProfileImageUrl'
}

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
              clientId: import.meta.env.VITE_APP_CLIENT_ID,
              scope: state.scopes
            })
            .then(() => {
              window.gapi.auth2
                .getAuthInstance()
                .isSignedIn
                .listen(signedIn => {
                  commit(AuthMutations.UPDATE_SIGNED_IN, signedIn)
                })

              const signedIn = window.gapi.auth2.getAuthInstance().isSignedIn.get()

              commit(AuthMutations.UPDATE_STARTED, true)
              commit(AuthMutations.UPDATE_SIGNED_IN, signedIn)

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
    },
    disconnect: function () {
      window.gapi.auth2.getAuthInstance().disconnect()
    }
  },
  mutations: {
    [AuthMutations.UPDATE_SIGNED_IN]: function (state, signedIn) {
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

    [AuthMutations.UPDATE_STARTED]: function (state, started) {
      state.started = started
    },

    [AuthMutations.UPDATE_PROFILE_NAME]: function (state, name) {
      state.profileName = name
    },

    [AuthMutations.UPDATE_PROFILE_EMAIL]: function (state, email) {
      state.profileEmail = email
    },

    [AuthMutations.UPDATE_PROFILE_IMAGE_URL]: function (state, imageUrl) {
      state.profileImageUrl = imageUrl
    }
  }
}
