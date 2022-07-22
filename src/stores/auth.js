import { acceptHMRUpdate, defineStore } from 'pinia'
import jwtDecode from 'jwt-decode'

import { loadApiAsync, promisify, whenAvailable } from '@/util/gapi'

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
    accessToken: null,
    authenticated: false,
    expiresIn: 0,
    eventListeners: {
      token: []
    },
    hasGrantedScopes: null,
    profileName: null,
    profileEmail: null,
    profileImageUrl: null,
    refreshing: false,
    started: false,
    tokenClient: null
  }),
  getters: {
    authorized: (state) => state.accessToken !== null,
    isAuthenticated: (state) => state.authenticated,
    isStarted: (state) => state.started
  },
  actions: {
    /**
     * Add a new event listener.
     *
     * @param {'token'} type The event type
     * @param {Function} listener The listener
     */
    addEventListener(type, listener) {
      this.eventListeners[type].push(listener)
    },

    /**
     * Remove a event listener.
     *
     * @param {'token'} type The event type
     * @param {Function} listener The listener
     */
    removeEventListener(type, listener) {
      this.eventListeners[type] = this.eventListeners[type].filter(
        (l) => l !== listener
      )
    },

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
     * Checks if the token is expired.
     *
     * @returns {boolean} If the token is expired.
     */
    expired() {
      return new Date().getTime() >= this.expiresIn
    },

    /**
     * Try to grant the missing permissions.
     */
    grantPermissions() {
      if (document.visibilityState === 'visible') {
        this.tokenClient.requestAccessToken({
          hint: this.profileEmail,
          prompt: ''
        })
        return
      }

      const handleVisibility = () => {
        if (document.visibilityState === 'visible') {
          this.tokenClient.requestAccessToken({
            hint: this.profileEmail,
            prompt: ''
          })
          document.removeEventListener('visibilitychange', handleVisibility)
        }
      }

      document.addEventListener('visibilitychange', handleVisibility)
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
      await loadApiAsync('client')

      const initThenable = window.gapi.client.init({
        discoveryDocs: DISCOVERY_DOCS
      })

      await promisify(initThenable)
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
          this.eventListeners.token.forEach((listener) =>
            listener.call(this, tokenResponse)
          )
        }
      })

      this.addEventListener('token', (tokenResponse) => {
        if (tokenResponse?.access_token) {
          this.$patch({
            accessToken: tokenResponse.access_token,
            expiresIn: new Date().getTime() + tokenResponse.expires_in * 1000,
            hasGrantedScopes: window.google.accounts.oauth2.hasGrantedAllScopes(
              tokenResponse,
              ...SCOPES
            ),
            refreshing: false
          })
        }
      })

      this.started = true
    },

    /**
     * Refresh the token if needed.
     */
    refreshToken() {
      if (this.expired() && !this.refreshing) {
        this.refreshing = true
        this.grantPermissions()
      }
    },

    /**
     * Refresh the token if needed, asynchronously.
     *
     * If the refreshing is already happening, the Promise
     * will be blocked to wait until it gets finished.
     *
     * @returns {Promise<void>} An promise that will resolve when refreshed.
     */
    async refreshTokenAsync() {
      return new Promise((resolve) => {
        if (!this.expired()) {
          resolve()
        }

        const handleToken = () => {
          this.removeEventListener('token', handleToken)

          if (this.refreshing === false) {
            resolve()
          }
        }

        if (!this.refreshing) {
          this.refreshing = true
          this.addEventListener('token', handleToken)
          this.grantPermissions()
        }
      })
    },

    /**
     * Attempt to sign out the user.
     */
    signOut() {
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
