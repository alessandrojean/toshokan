import type Book from '@/model/Book'

/**
 * Base class for the book cover finders.
 */
export default class CoverFinder {
  name = ''

  /**
   * Find covers for the book.
   *
   * @param {Book} book The book
   * @returns {Promise<string[]>} An array of covers found
   */
  // eslint-disable-next-line unused-imports/no-unused-vars
  async find(book: Book): Promise<string[]> {
    throw new Error('Not implemented!')
  }
}
