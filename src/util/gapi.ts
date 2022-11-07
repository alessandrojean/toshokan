import { useAuthStore } from '@/stores/auth'

export const STATUS_CODE_FORBIDDEN = 403
export const STATUS_CODE_TIMEOUT = 408
export const STATUS_CODE_UNAUTHORIZED = 401

type Request<T> = gapi.client.Request<T>
type Response<T> = gapi.client.Response<T>

/**
 * Google GAPI returns a Thenable instead of ES6 Promises.
 *
 * This function converts a Thenable to a {@link Promise}.
 *
 * @param {Request<T>} thenable The original thenable.
 * @returns {Response<T>} An ES6 Promise.
 * @template T
 */
export function promisify<T>(thenable: Request<T>): Promise<Response<T>> {
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
export function loadApiAsync(api: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    window.gapi.load(api, {
      // @ts-ignore Missing documentation on types package.
      callback: () => resolve(),
      onerror: (reason: string) => reject(reason)
    })
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
export async function fetch<T>(promise: Promise<T>): Promise<T | undefined> {
  const authStore = useAuthStore()
  const maxAttempts = 3
  const refreshStatusCodes = [STATUS_CODE_FORBIDDEN, STATUS_CODE_UNAUTHORIZED]

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      if (authStore.expired()) {
        await authStore.refreshTokenAsync()
      }

      return await promise
    } catch (error: any) {
      if (attempt === maxAttempts) {
        throw error
      }

      if (refreshStatusCodes.includes(error?.status ?? -1)) {
        await authStore.refreshTokenAsync()
      }

      attempt++
    }
  }
}

/**
 * Wait until a key gets available in {@link Window}.
 */
export async function whenAvailable(
  name: keyof typeof window,
  intervalMs = 100
): Promise<void> {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (window[name]) {
        clearInterval(interval)
        resolve()
      }
    }, intervalMs)
  })
}
