import { promisify } from '@/util/gapi'
import Book from '@/model/Book'

/**
 * Insert a book in the sheet.
 *
 * @param {string} sheetId The ID of the sheet to insert the book.
 * @param {Book} book The book to be inserted.
 * @returns {Promise<string>}
 */
export default async function insertBook(
  sheetId: string,
  book: Book
): Promise<string> {
  const bookFormatted = book.toArray()

  const thenable = window.gapi.client.sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: 'Collection!B5',
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    resource: { range: 'Collection!B5', values: [bookFormatted] }
  })

  await promisify(thenable)

  return bookFormatted[1]
}
