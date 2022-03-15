import { acceptHMRUpdate, defineStore } from 'pinia'
import i18n from '@/i18n'

import jwtDecode from 'jwt-decode'

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

async function whenAvailable(name, intervalMs = 100) {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (window[name]) {
        clearInterval(interval)
        resolve()
      }
    }, intervalMs)
  })
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null,
    expiresIn: 0,
    hasGrantedScopes: null,
    started: false,
    authenticated: false,
    profileName: null,
    profileEmail: null,
    profileImageUrl: null,
    refreshing: false,
    tokenClient: null
  }),
  getters: {
    authorized: (state) => state.accessToken !== null,
    isAuthenticated: (state) => state.authenticated,
    isStarted: (state) => state.started
  },
  actions: {
    clear() {
      this.$patch({
        accessToken: null,
        expiresIn: 0,
        authenticated: false,
        hasGrantedScopes: false,
        profileEmail: null,
        profileName: null,
        profileImageUrl: null,
        refreshing: false
      })
    },

    /**
     * Attempt to disconnect the user.
     */
    disconnect() {
      window.google.accounts.oauth2.revoke(this.accessToken)
      window.google.accounts.id.revoke(this.profileEmail)
      window.google.accounts.id.disableAutoSelect()

      this.clear()
    },

    /**
     * Try to grant the missing permissions.
     */
    grantPermissions() {
      this.tokenClient.requestAccessToken({
        hint: this.profileEmail,
        prompt: ''
      })
    },

    /**
     * Init the authentication.
     *
     * @returns {Promise<void>}
     */
    async initApp() {
      await this.initGoogleApiClient()
      await this.initGoogleIdentityServices()
    },

    /**
     * Init the Google Api Client.
     *
     * @returns {Promise<void>}
     */
    async initGoogleApiClient() {
      await whenAvailable('gapi')

      return new Promise((resolve, reject) => {
        window.gapi.load('client', () => {
          window.gapi.client.init({ discoveryDocs: DISCOVERY_DOCS }).then(
            () => resolve(),
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
     * Init the new Google Identity Services SDK.
     */
    async initGoogleIdentityServices() {
      await whenAvailable('google')

      window.google.accounts.id.initialize({
        auto_select: true,
        client_id: import.meta.env.VITE_APP_CLIENT_ID,
        context: 'use',
        callback: (credentialResponse) => {
          const payload = jwtDecode(credentialResponse.credential)

          this.updateProfile(payload)

          if (!this.hasGrantedScopes) {
            this.grantPermissions()
          }

          this.authenticated = true
        }
      })

      this.tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: import.meta.env.VITE_APP_CLIENT_ID,
        scope: SCOPES.join(' '),
        prompt: 'consent',
        callback: (tokenResponse) => {
          if (tokenResponse?.access_token) {
            this.$patch({
              accessToken: tokenResponse.access_token,
              expiresIn: new Date().getTime() + tokenResponse.expires_in,
              hasGrantedScopes:
                window.google.accounts.oauth2.hasGrantedAllScopes(
                  tokenResponse,
                  ...SCOPES
                ),
              refreshing: false
            })
          }
        }
      })

      this.started = true
    },

    /**
     * Refresh the token if needed.
     */
    refreshToken() {
      if (new Date().getTime() > this.expiresIn && !this.refreshing) {
        this.refreshing = true
        this.grantPermissions()
      }
    },

    /**
     * Attempt to sign out the user.
     */
    signOut() {
      // window.google.accounts.oauth2.revoke(this.accessToken)
      window.google.accounts.id.disableAutoSelect()

      this.clear()
    },

    /**
     * Update the profile data.
     *
     * @param {object} account The account info
     * @param {string | null} account.name The profile name
     * @param {string | null} account.email The profile email
     * @param {string | null} account.picture The profile picture
     */
    updateProfile({ name, email, picture }) {
      this.$patch({
        profileName: name,
        profileEmail: email,
        profileImageUrl: picture
      })
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
