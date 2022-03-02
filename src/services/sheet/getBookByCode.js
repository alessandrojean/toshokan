import buildSheetUrl from './buildSheetUrl'

import Book, { CollectionColumns } from '@/model/Book'
import QueryBuilder from '@/data/QueryBuilder'

/**
 * Find books by the code.
 *
 * @param {string} sheetId The sheet to perform the operation
 * @param {string} code The code to find
 * @returns {Promise<Book[] | null>} The books found
 */
export default async function getBookByCode(sheetId, code) {
  const sheetUrl = buildSheetUrl(sheetId)

  const { CODE } = CollectionColumns
  const query = new QueryBuilder(sheetUrl).where(CODE, code).build()

  const dataTable = await query.send()

  if (dataTable.rows === 0) {
    return null
  }

  return dataTable.asArray.map(Book.fromDataTable)
}
