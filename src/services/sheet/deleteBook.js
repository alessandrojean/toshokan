export default async function deleteBook (sheetId, book) {
  const bookRow = parseInt(book.sheetLocation.substring(12))

  await window.gapi.client.sheets.spreadsheets
    .batchUpdate({
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
}
