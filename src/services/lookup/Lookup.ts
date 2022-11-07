import type { Axios } from 'axios'
import Book from '@/model/Book'

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
   * @param {String} isbn The ISBN to search
   * @returns {Promise<T[]>} An array of books found
   */
  async search(isbn: string): Promise<Book[]> {
    throw new Error('Not implemented!')
  }
}
