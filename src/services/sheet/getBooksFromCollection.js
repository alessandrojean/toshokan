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

  if (dataTable.rows < 2) {
    return []
  }

  return dataTable.asArray.map(Book.fromDataTable)
}
