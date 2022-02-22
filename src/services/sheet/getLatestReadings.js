import buildSheetUrl from './buildSheetUrl'
import { PER_PAGE } from './constants'

import Book, { CollectionColumns, STATUS_READ } from '@/model/Book'
import QueryBuilder from '@/data/QueryBuilder'

/**
 * Find the last books read.
 *
 * @param {string} sheetId The sheet to perform the operation
 * @param {Object} options The options
 * @param {number?} options.limit The limit
 * @returns {Promise<Book[]}>} The books found
 */
export default async function getLatestReadings (sheetId, options = {}) {
  const sheetUrl = buildSheetUrl(sheetId)

  const { STATUS, READ_AT, UPDATED_AT } = CollectionColumns
  const query = new QueryBuilder(sheetUrl)
    .where(READ_AT)
    .andWhere(STATUS, STATUS_READ)
    .orderBy([READ_AT, 'desc'], [UPDATED_AT, 'desc'])
    .limit(options.limit || PER_PAGE)
    .build()

  const dataTable = await query.send()

  const rows = dataTable.getNumberOfRows()
  const books = []

  for (let i = 0; i < rows; i++) {
    books.push(Book.fromDataTable(dataTable, i))
  }

  return books
}
