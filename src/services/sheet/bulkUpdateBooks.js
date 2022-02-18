/**
 * Bulk update books in the sheet.
 *
 * @param {string} sheetId The ID of the sheet to update the books.
 * @param {import('../../model/Book').default[]} books The books to update.
 */
export default async function bulkUpdateBooks (sheetId, books) {
  await window.gapi.client.sheets.spreadsheets.values
    .batchUpdate({
      spreadsheetId: sheetId,
      resource: {
        valueInputOption: 'USER_ENTERED',
        data: books.map(book => ({
          range: book.sheetLocation,
          values: [book.toArray()]
        }))
      }
    })
}
