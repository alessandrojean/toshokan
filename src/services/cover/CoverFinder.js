/**
 * Base class for the book cover finders.
 */
export default class CoverFinder {
  name = ''

  /**
   * Find covers for the book.
   *
   * @param {import('@/model/Book').default} book The book
   * @returns {Promise<string[]>} An array of covers found
   */
  async find(book) {
    throw new Error('Not implemented!')
  }
}
