import buildSheetUrl from './buildSheetUrl'

import QueryBuilder from '@/data/QueryBuilder'
import Book, { CollectionColumns, Columns } from '@/model/Book'

/**
 * Find the book neighbors.
 *
 * @param {string} sheetId The sheet to perform the operation
 * @param {Book} book The code to find
 * @returns {Promise<{ previous: Book, next: Book } | null>} The books found
 */
export default async function getBookNeighbors (sheetId, book) {
  const sheetUrl = buildSheetUrl(sheetId)

  const { TITLE, PUBLISHER, GROUP } = CollectionColumns
  const query = new QueryBuilder(sheetUrl)
    .where(TITLE, 'starts with', book.titleParts.title)
    .andWhere(PUBLISHER, book.publisher)
    .andWhere(GROUP, book.group)
    .orderBy([TITLE, 'asc'])
    .build()

  const dataTable = await query.send()

  if (dataTable.rows < 2) {
    return null
  }

  const bookRow = dataTable.asArray
    .findIndex(rowData => rowData[Columns.TITLE] === book.title)

  const previous = bookRow > 0
    ? Book.fromDataTable(dataTable.getRow(bookRow - 1))
    : null

  const next = bookRow < dataTable.rows - 1
    ? Book.fromDataTable(dataTable.getRow(bookRow + 1))
    : null

  return { previous, next }
}
