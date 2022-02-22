/**
 * Bulk delete books in the sheet.
 *
 * @param {string} sheetId The sheet to perform the operation
 * @param {import('@/model/Book').default[]} books The books to delete
 */
export default async function bulkDeleteBooks (sheetId, books) {
  await window.gapi.client.sheets.spreadsheets
    .batchUpdate({
      spreadsheetId: sheetId,
      resource: {
        requests: books.map(book => {
          const bookRow = parseInt(book.sheetLocation.substring(12))

          return {
            deleteDimension: {
              range: {
                sheetId: 0,
                dimension: 'ROWS',
                startIndex: bookRow - 1,
                endIndex: bookRow
              }
            }
          }
        })
      }
    })
}
