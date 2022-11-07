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
] as const

type OAuthTokenClient = google.accounts.oauth2.TokenClient
type TokenResponse = google.accounts.oauth2.TokenResponse

type Credential = {
  name: string
  email: string
  picture: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null as string | null,
    authenticated: false,
    expiresIn: 0,
    hasGrantedScopes: null as boolean | null,
    profileName: null as string | null,
    profileEmail: null as string | null,
    profileImageUrl: null as string | null,
    refreshing: false,
    started: false,
    tokenClient: null as OAuthTokenClient | null
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
      // @ts-ignore Missing definitions for revoke.
      window.google.accounts.oauth2.revoke(this.accessToken!)
      window.google.accounts.id.revoke(this.profileEmail!)
      window.google.accounts.id.disableAutoSelect()

      this.clear()
    },

    /**
     * Checks if the token is expired.
     *
     * @returns {boolean} If the token is expired.
     */
    expired(): boolean {
      return new Date().getTime() >= this.expiresIn
    },

    /**
     * Try to grant the missing permissions.
     */
    grantPermissions() {
      if (document.visibilityState === 'visible') {
        this.tokenClient!.requestAccessToken({
          hint: this.profileEmail!,
          prompt: ''
        })
        return
      }

      const handleVisibility = () => {
        if (document.visibilityState === 'visible') {
          this.tokenClient!.requestAccessToken({
            hint: this.profileEmail!,
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
    async initApp(): Promise<void> {
      await this.initGoogleApiClient()
      await this.initGoogleIdentityServices()
    },

    /**
     * Init the Google Api Client.
     *
     * @returns {Promise<void>}
     */
    async initGoogleApiClient(): Promise<void> {
      await whenAvailable('gapi')
      await loadApiAsync('client')

      // @ts-ignore Missing definitions
      const initThenable = window.gapi.client.init({
        discoveryDocs: DISCOVERY_DOCS
      })

      await promisify<void>(initThenable)
    },

    /**
     * Init the new Google Identity Services SDK.
     */
    async initGoogleIdentityServices(): Promise<void> {
      await whenAvailable('google')

      this.tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: import.meta.env.VITE_APP_CLIENT_ID,
        scope: SCOPES.join(' '),
        prompt: 'consent',
        callback: (tokenResponse) => {
          if (tokenResponse?.access_token) {
            this.$patch({
              accessToken: tokenResponse.access_token,
              expiresIn:
                new Date().getTime() +
                parseInt(tokenResponse.expires_in, 10) * 1000,
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

      window.google.accounts.id.initialize({
        auto_select: true,
        client_id: import.meta.env.VITE_APP_CLIENT_ID,
        context: 'use',
        callback: (credentialResponse) => {
          const payload = jwtDecode<Credential>(credentialResponse.credential)

          this.updateProfile(payload)

          if (!this.hasGrantedScopes) {
            this.grantPermissions()
          }

          this.authenticated = true
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
    async refreshTokenAsync(): Promise<void> {
      return new Promise((resolve) => {
        if (!this.expired()) {
          resolve()
        }

        const removeWatcher = this.$subscribe(
          (_, state) => {
            if (state.refreshing === false) {
              removeWatcher()
              resolve()
            }
          },
          { detached: true }
        )

        if (!this.refreshing) {
          this.refreshing = true
          this.grantPermissions()
        }
      })
    },

    /**
     * Attempt to sign out the user.
     */
    async signOut() {
      window.google.accounts.id.disableAutoSelect()

      this.clear()
    },

    /**
     * Update the profile data.
     *
     * @param {Credential} account The account info
     */
    updateProfile({ name, email, picture }: Credential) {
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
