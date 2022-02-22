import buildSheetUrl from './buildSheetUrl'

import QueryBuilder from '@/data/QueryBuilder'
import Book, { CollectionColumns } from '@/model/Book'

/**
 * Find books of the same collection.
 *
 * @param {string} sheetId The sheet to perform the operation
 * @param {Book} book The book to find
 * @returns {Promise<Book[]>} The books found
 */
export default async function getBooksFromCollection (sheetId, book) {
  const sheetUrl = buildSheetUrl(sheetId)

  const { TITLE, PUBLISHER, GROUP } = CollectionColumns
  const query = new QueryBuilder(sheetUrl)
    .where(TITLE, 'starts with', book.titleParts.title + ' #')
    .andWhere(PUBLISHER, book.publisher)
    .andWhere(GROUP, book.group)
    .orderBy([TITLE, 'asc'])
    .build()

  const dataTable = await query.send()
  const rows = dataTable.getNumberOfRows()
  const books = []

  if (rows < 2) {
    return books
  }

  for (let i = 0; i < rows; i++) {
    books.push(Book.fromDataTable(dataTable, i))
  }

  return books
}
