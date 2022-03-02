/**
 * Insert a book in the sheet.
 *
 * @param {string} sheetId The ID of the sheet to insert the book.
 * @param {import('@/model/Book').default} book The book to be inserted.
 * @returns {Promise<string>}
 */
export default async function insertBook(sheetId, book) {
  const bookFormatted = book.toArray()

  await window.gapi.client.sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: 'Collection!B5',
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    values: [bookFormatted]
  })

  return bookFormatted[1]
}
