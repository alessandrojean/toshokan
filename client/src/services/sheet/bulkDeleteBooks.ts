import { promisify } from '@/util/gapi'
import type Book from '@/model/Book'

/**
 * Bulk delete books in the sheet.
 *
 * @param {string} sheetId The sheet to perform the operation
 * @param {Book[]} books The books to delete
 */
export default async function bulkDeleteBooks(sheetId: string, books: Book[]) {
  const thenable = window.gapi.client.sheets.spreadsheets.batchUpdate({
    spreadsheetId: sheetId,
    resource: {
      requests: books.map((book) => {
        const bookRow = Number.parseInt(book.sheetLocation!.substring(12))

        return {
          deleteDimension: {
            range: {
              sheetId: 0,
              dimension: 'ROWS',
              startIndex: bookRow - 1,
              endIndex: bookRow,
            },
          },
        }
      }),
    },
  })

  await promisify(thenable)
}
