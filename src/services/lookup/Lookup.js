/**
 * Base class for the book lookup services.
 */
export default class Lookup {
  /**
   * Axios instance to API calls.
   *
   * @type {import('axios').default}
   */
  axios = null

  constructor () {
    this.axios = this._createAxios()
  }

  /**
   * Creates the axios instance to be used inside the class.
   *
   * @returns {import('axios').default} the axios instance
   */
  _createAxios () {
    throw new Error('Not implemented!')
  }

  /**
   * Search a book using the ISBN provided.
   *
   * @param {String} isbn The ISBN to search
   * @returns {Promise<Object[]>} An array of books found
   */
  async search (isbn) {
    throw new Error('Not implemented!')
  }
}
