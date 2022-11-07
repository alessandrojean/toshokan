import buildSheetUrl from './buildSheetUrl'

import QueryBuilder from '@/data/QueryBuilder'
import Book from '@/model/Book'

/**
 * Search for books.
 *
 * @param {string} sheetId The sheet to perform the operation
 * @returns {Promise<Book[]>} The library books
 */
export default async function getWholeLibrary(
  sheetId: string
): Promise<Book[]> {
  const sheetUrl = buildSheetUrl(sheetId)

  const queryBuilder = new QueryBuilder(sheetUrl)
  const query = queryBuilder.build()

  const dataTable = await query.send()

  return dataTable.asArray.map(Book.fromDataTable)
}
