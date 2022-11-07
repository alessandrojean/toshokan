import { promisify } from '@/util/gapi'
import Book from '@/model/Book'

/**
 * Update a book in the sheet.
 *
 * @param {string} sheetId The sheet to perform the operation
 * @param {Book} book The book to update
 */
export default async function updateBook(sheetId: string, book: Book) {
  const bookFormatted = book.toArray()

  const thenable = window.gapi.client.sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: book.sheetLocation!,
    valueInputOption: 'USER_ENTERED',
    resource: { range: book.sheetLocation!, values: [bookFormatted] }
  })

  await promisify(thenable)
}
