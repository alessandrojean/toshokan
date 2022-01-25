import i18n from '@/i18n'

const { t } = i18n.global

export const AuthMutations = {
  UPDATE_GOOGLE_AUTH: 'updateGoogleAuth',
  UPDATE_HAS_GRANTED_SCOPES: 'updateHasGrantedScopes',
  UPDATE_SIGNED_IN: 'updateSignedIn',
  UPDATE_STARTED: 'updateStarted',
  UPDATE_PROFILE_NAME: 'updateProfileName',
  UPDATE_PROFILE_EMAIL: 'updateProfileEmail',
  UPDATE_PROFILE_IMAGE_URL: 'updateProfileImageUrl'
}

const GoogleApiErrors = {
  COOKIES_DISABLED: 'Cookies are not enabled in current environment.'
}

const DISCOVERY_DOCS = [
  'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
  'https://sheets.googleapis.com/$discovery/rest?version=v4'
]

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.metadata.readonly'
]

export default {
  namespaced: true,
  state: () => ({
    googleAuth: null,
    hasGrantedScopes: null,
    started: false,
    signedIn: false,
    profileName: null,
    profileEmail: null,
    profileImageUrl: null
  }),
  getters: {
    hasGrantedScopes: state => {
      return state.googleAuth?.currentUser?.get()
        ?.hasGrantedScopes(SCOPES.join(' '))
    },
    isSignedIn: state => state.signedIn,
    isStarted: state => state.started
  },
  actions: {
    initApp: function ({ commit, state, getters }) {
      return new Promise((resolve, reject) => {
        window.gapi.load('client:auth2', () => {
          window.gapi.client
            .init({
              discoveryDocs: DISCOVERY_DOCS,
              clientId: import.meta.env.VITE_APP_CLIENT_ID,
              scope: SCOPES.join(' ')
            })
            .then(() => {
              commit(
                AuthMutations.UPDATE_GOOGLE_AUTH,
                window.gapi.auth2.getAuthInstance()
              )

              state.googleAuth.isSignedIn.listen(signedIn => {
                commit(AuthMutations.UPDATE_SIGNED_IN, signedIn)
              })

              const signedIn = state.googleAuth.isSignedIn.get()
              const hasGrantedScopes = state.googleAuth?.currentUser?.get()
                ?.hasGrantedScopes(SCOPES.join(' '))

              commit(AuthMutations.UPDATE_STARTED, true)
              commit(AuthMutations.UPDATE_SIGNED_IN, signedIn)
              commit(AuthMutations.UPDATE_HAS_GRANTED_SCOPES, hasGrantedScopes)

              resolve(signedIn)
            }, (error) => {
              const errorMessage =
                error.details === GoogleApiErrors.COOKIES_DISABLED
                  ? t('errors.cookiesDisabled')
                  : t('errors.authStartedFailed')

              reject(new Error(errorMessage, {
                cause: { ...error, refresh: true }
              }))
            })
        })
      })
    },
    grantPermissions: async function ({ state, commit }) {
      const GoogleUser = state.googleAuth?.currentUser?.get()
      const missingScopes = SCOPES.filter(scope => {
        return !GoogleUser.hasGrantedScopes(scope)
      })

      if (missingScopes.length) {
        await state.googleAuth?.currentUser?.get()
          ?.grant({ scope: missingScopes.join(' ') })

        commit(
          AuthMutations.UPDATE_HAS_GRANTED_SCOPES,
          state.googleAuth?.currentUser?.get()
            ?.hasGrantedScopes(SCOPES.join(' '))
        )
      }
    },
    signIn: async function ({ state }) {
      try {
        await state.googleAuth.signIn()
      } catch (e) {
        // Do nothing.
      }
    },
    signOut: async function ({ state }) {
      await state.googleAuth.signOut()
    },
    disconnect: async function ({ state }) {
      state.googleAuth.disconnect()
    }
  },
  mutations: {
    [AuthMutations.UPDATE_GOOGLE_AUTH]: function (state, googleAuth) {
      state.googleAuth = googleAuth
    },

    [AuthMutations.UPDATE_HAS_GRANTED_SCOPES]: function (state, hasGrantedScopes) {
      state.hasGrantedScopes = hasGrantedScopes
    },

    [AuthMutations.UPDATE_SIGNED_IN]: function (state, signedIn) {
      state.signedIn = signedIn

      if (signedIn) {
        const user = state.googleAuth.currentUser.get()
        const profile = user.getBasicProfile()

        state.profileName = profile.getName()
        state.profileEmail = profile.getEmail()
        state.profileImageUrl = profile.getImageUrl()
        state.hasGrantedScopes = user.hasGrantedScopes(SCOPES.join(' '))
      } else {
        state.profileName = null
        state.profileEmail = null
        state.profileImageUrl = null
        state.hasGrantedScopes = null
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
