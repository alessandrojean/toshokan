import Book from '@/model/Book'

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
  async find(book: Book): Promise<string[]> {
    throw new Error('Not implemented!')
  }
}
