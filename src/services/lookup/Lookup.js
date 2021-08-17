/**
 * Base class for the book lookup services.
 */
export default class Lookup {
  /**
   * Axios instance to API calls.
   *
   * @type {typeof import('axios').default}
   */
  axios = null

  constructor () {
    this.axios = this.createAxios()
  }

  /**
   * Creates the axios instance to be used inside the class.
   *
   * @returns {typeof import('axios').default} the axios instance
   */
  createAxios () {
    throw new Error('Not implemented!')
  }

  /**
   * Search a book using the ISBN provided.
   *
   * @param {String} isbn
   * @returns {Promise<Object[]>} an array of books found
   */
  async search (isbn) {
    throw new Error('Not implemented!')
  }
}
