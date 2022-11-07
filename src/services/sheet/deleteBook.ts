import { promisify } from '@/util/gapi'
import Book from '@/model/Book'

/**
 * Delete a book in the sheet.
 *
 * @param {string} sheetId The sheet to perform the operation
 * @param {Book} book The book to delete
 */
export default async function deleteBook(sheetId: string, book: Book) {
  const bookRow = parseInt(book.sheetLocation!.substring(12))

  const thenable = window.gapi.client.sheets.spreadsheets.batchUpdate({
    spreadsheetId: sheetId,
    resource: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId: 0,
              dimension: 'ROWS',
              startIndex: bookRow - 1,
              endIndex: bookRow
            }
          }
        }
      ]
    }
  })

  return await promisify(thenable)
}
