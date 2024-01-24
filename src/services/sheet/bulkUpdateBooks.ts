import { promisify } from '@/util/gapi'
import type Book from '@/model/Book'

/**
 * Bulk update books in the sheet.
 *
 * @param {string} sheetId The ID of the sheet to update the books.
 * @param {Book[]} books The books to update.
 */
export default async function bulkUpdateBooks(sheetId: string, books: Book[]) {
  const thenable = window.gapi.client.sheets.spreadsheets.values.batchUpdate({
    spreadsheetId: sheetId,
    resource: {
      valueInputOption: 'USER_ENTERED',
      data: books.map(book => ({
        range: book.sheetLocation!,
        values: [book.toArray()],
      })),
    },
  })

  return await promisify(thenable)
}
