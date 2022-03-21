import { useAuthStore } from '@/stores/auth'

export const STATUS_CODE_FORBIDDEN = 403
export const STATUS_CODE_TIMEOUT = 408
export const STATUS_CODE_UNAUTHORIZED = 401

/**
 * Google GAPI returns a Thenable instead of ES6 Promises.
 *
 * This function converts a Thenable to a {@link Promise}.
 *
 * @param {gapi.client.Request<T>} thenable The original thenable.
 * @returns {Promise<gapi.client.Response<T>>} An ES6 Promise.
 * @template T
 */
export function promisify(thenable) {
  return new Promise((resolve, reject) => {
    thenable.then(
      (response) => resolve(response),
      (reason) =>
        reject({
          message: reason.result.error.message,
          status: reason.result.error.code,
          reason
        })
    )
  })
}

/**
 * An ES6 {@link Promise} version of {@link gapi.load}.
 *
 * @param {string} api The API to load.
 * @returns {Promise<void>}
 */
export function loadApiAsync(api) {
  return new Promise((resolve, reject) => {
    window.gapi.load(api, { callback: resolve, onerror: reject })
  })
}

/**
 * Fetch a {@link Promise} and refresh the token if it fails
 * and it's expired (i.e. returns 401).
 *
 * @param {Promise<T>} promise The original promise.
 * @returns {Promise<T>} A new promise
 * @template T
 */
export async function fetch(promise) {
  const authStore = useAuthStore()
  const maxAttempts = 3
  const refreshStatusCodes = [STATUS_CODE_FORBIDDEN, STATUS_CODE_UNAUTHORIZED]

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      if (authStore.expired()) {
        await authStore.refreshTokenAsync()
      }

      return await promise
    } catch (error) {
      if (attempt === maxAttempts) {
        throw error
      }

      if (refreshStatusCodes.includes(error.status)) {
        await authStore.refreshTokenAsync()
      }

      attempt++
    }
  }
}

/**
 * Wait until a key gets available in {@link Window}.
 *
 * @param {string} name The key in {@link Window}
 * @param {number} intervalMs The interval time
 * @returns {Promise<void>} An promise that will resolve when available.
 */
export async function whenAvailable(name, intervalMs = 100) {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (window[name]) {
        clearInterval(interval)
        resolve()
      }
    }, intervalMs)
  })
}
