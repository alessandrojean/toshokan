import type { Axios } from 'axios'
import type Book from '@/model/Book'

/**
 * Base class for the book lookup services.
 */
export default class Lookup {
  /**
   * Axios instance to API calls.
   */
  axios: Axios

  constructor() {
    this.axios = this._createAxios()
  }

  // eslint-disable-next-line jsdoc/require-returns-check
  /**
   * Creates the axios instance to be used inside the class.
   *
   * @returns {Axios} the axios instance
   */
  _createAxios(): Axios {
    throw new Error('Not implemented!')
  }

  /**
   * Search a book using the ISBN provided.
   *
   * @param {string} isbn The ISBN to search
   * @returns {Promise<T[]>} An array of books found
   */
  // eslint-disable-next-line unused-imports/no-unused-vars
  async search(isbn: string): Promise<Book[]> {
    throw new Error('Not implemented!')
  }
}
