import buildSheetUrl from './buildSheetUrl'

import Book, { CollectionColumns } from '@/model/Book'
import QueryBuilder from '@/data/QueryBuilder'

/**
 * Find a book by the ID.
 *
 * @param {string} sheetId The sheet to perform the operation
 * @param {string} id The ID to find
 * @returns {Promise<Book | null>} The book found
 */
export default async function getBookById(sheetId, id) {
  const sheetUrl = buildSheetUrl(sheetId)

  const { ID } = CollectionColumns
  const query = new QueryBuilder(sheetUrl).where(ID, id).build()

  const dataTable = await query.send()

  if (dataTable.rows === 0) {
    return null
  }

  return Book.fromDataTable(dataTable.getRow(0))
}
