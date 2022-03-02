import { defineStore } from 'pinia'
import i18n from '@/i18n'

const { t } = i18n.global

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

export const useAuthStore = defineStore('auth', {
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
    isSignedIn: (state) => state.signedIn,
    isStarted: (state) => state.started
  },
  actions: {
    /**
     * Attempt to disconnect the user.
     */
    disconnect() {
      this.googleAuth?.disconnect()
    },

    /**
     * Try to grant the missing permissions.
     */
    async grantPermissions() {
      const GoogleUser = this.googleAuth?.currentUser?.get()
      const missingScopes = SCOPES.filter((scope) => {
        return !GoogleUser.hasGrantedScopes(scope)
      })

      if (missingScopes.length) {
        await this.googleAuth?.currentUser
          ?.get()
          ?.grant({ scope: missingScopes.join(' ') })

        this.hasGrantedScopes = this.googleAuth?.currentUser
          ?.get()
          ?.hasGrantedScopes(SCOPES.join(' '))
      }
    },

    /**
     * Init the authentication.
     *
     * @returns {Promise<boolean>} the signedIn status
     */
    async initApp() {
      return new Promise((resolve, reject) => {
        window.gapi.load('client:auth2', () => {
          window.gapi.client
            .init({
              discoveryDocs: DISCOVERY_DOCS,
              clientId: import.meta.env.VITE_APP_CLIENT_ID,
              scope: SCOPES.join(' ')
            })
            .then(
              () => {
                this.googleAuth = window.gapi.auth2.getAuthInstance()

                this.googleAuth.isSignedIn.listen((signedIn) => {
                  this.updateSignedIn(signedIn)
                })

                const signedIn = this.googleAuth.isSignedIn.get()
                const hasGrantedScopes = this.hasGrantedScopes

                this.started = true
                this.updateSignedIn(signedIn)
                this.hasGrantedScopes = hasGrantedScopes

                resolve(signedIn)
              },
              (error) => {
                const errorMessage =
                  error.details === GoogleApiErrors.COOKIES_DISABLED
                    ? t('errors.cookiesDisabled')
                    : t('errors.authStartedFailed')

                reject(
                  new Error(errorMessage, {
                    cause: { ...error, refresh: true }
                  })
                )
              }
            )
        })
      })
    },

    /**
     * Attempt to sign in the user.
     */
    async signIn() {
      try {
        await this.googleAuth?.signIn()
      } catch (e) {
        // Do nothing.
      }
    },

    /**
     * Attempt to sign out the user.
     */
    async signOut() {
      await this.googleAuth?.signOut()
    },

    /**
     * Updates the user information.
     *
     * @param {boolean} signedIn the signedIn status
     */
    updateSignedIn(signedIn) {
      this.signedIn = signedIn

      if (signedIn) {
        const user = this.googleAuth.currentUser.get()
        const profile = user.getBasicProfile()

        this.profileName = profile.getName()
        this.profileEmail = profile.getEmail()
        this.profileImageUrl = profile.getImageUrl()
        this.hasGrantedScopes = user.hasGrantedScopes(SCOPES.join(' '))
      } else {
        this.profileName = null
        this.profileEmail = null
        this.profileImageUrl = null
        this.hasGrantedScopes = null
      }
    }
  }
})
