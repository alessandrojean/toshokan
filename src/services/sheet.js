import groupBy from 'lodash.groupby'
import uniqBy from 'lodash.uniqby'

import { bookCompare, formatBook, parseBook } from '@/model/Book'

const SHEET_FILE_NAME = 'Toshokan'
const SHEET_MIME_TYPE = 'application/vnd.google-apps.spreadsheet'

export async function findSheetId () {
  // Use a development only sheet to prevent issues during tests.
  const fileName = SHEET_FILE_NAME +
    (process.env.NODE_ENV === 'development' ? '-dev' : '')

  const response = await window.gapi.client.drive.files.list({
    q: `name='${fileName}' and mimeType='${SHEET_MIME_TYPE}'`,
    orderBy: 'starred'
  })

  if (response.result.files.length > 0) {
    return response.result.files[0].id
  }

  throw new Error('Planilha não encontrada.')
}

const COLLECTION_RANGE = 'Coleção!B5:Q'
const TOTAL_RANGE = 'Estatísticas!C5'
const MONEY_RANGE = 'Estatísticas!C8:C11'
const STATUS_RANGE = 'Estatísticas!C14:C16'
const MONTHLY_RANGE = 'Estatísticas!E5:G'
const AUTHORS_RANGE = 'Estatísticas!I5:J'
const SERIES_RANGE = 'Estatísticas!L5:M'
const IMPRINTS_RANGE = 'Estatísticas!O5:P'

export async function getSheetData (sheetId) {
  const response = await window.gapi.client.sheets.spreadsheets.values
    .batchGet({
      spreadsheetId: sheetId,
      ranges: [
        COLLECTION_RANGE,
        TOTAL_RANGE,
        MONEY_RANGE,
        STATUS_RANGE,
        MONTHLY_RANGE,
        AUTHORS_RANGE,
        SERIES_RANGE,
        IMPRINTS_RANGE
      ]
    })

  const books = (response.result.valueRanges[0].values || [])
    .map(parseBook)

  const lastAdded = books.slice(-6).reverse()

  books.sort(bookCompare)

  const imprints = uniqBy(books, 'imprint')
    .map(b => b.imprint)
    .sort()

  const stores = uniqBy(books, 'store')
    .map(b => b.store)
    .sort()

  const collection = groupBy(books, 'collection')

  const stats = {
    count: parseInt(response.result.valueRanges[1].values[0][0]),
    money: {
      totalSpentLabel: response.result.valueRanges[2].values[0][0],
      totalSpentPaid: response.result.valueRanges[2].values[1][0],
      saved: response.result.valueRanges[2].values[2][0],
      percent: response.result.valueRanges[2].values[3][0]
    },
    status: {
      read: response.result.valueRanges[3].values[0][0],
      unread: response.result.valueRanges[3].values[1][0],
      percent: response.result.valueRanges[3].values[2][0]
    },
    monthly: (response.result.valueRanges[4].values || [])
      .slice(0, 10)
      .reverse()
      .map(row => ({
        month: row[0],
        totalSpent: row[1],
        count: row[2]
      })),
    authors: (response.result.valueRanges[5].values || [])
      .slice(0, 10)
      .map(row => ({ name: row[0], count: row[1] })),
    series: (response.result.valueRanges[6].values || [])
      .slice(0, 10)
      .map(row => ({ name: row[0], count: row[1] })),
    imprints: (response.result.valueRanges[7].values || [])
      .slice(0, 10)
      .map(row => ({ name: row[0], count: row[1] })),
    itemsByCollection: Object.entries(collection)
      .map(entry => ({ collection: entry[0], items: entry[1].length }))
  }

  return {
    lastAdded,
    collection,
    imprints,
    stores,
    stats
  }
}

export async function insertBook (sheetId, book) {
  const bookFormatted = formatBook(book)

  await window.gapi.client.sheets.spreadsheets.values
    .append({
      spreadsheetId: sheetId,
      range: 'Coleção!B5',
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      values: [bookFormatted]
    })

  return bookFormatted[0]
}

export async function updateBook (sheetId, book) {
  const bookFormatted = formatBook(book)

  await window.gapi.client.sheets.spreadsheets.values
    .update({
      spreadsheetId: sheetId,
      range: book.sheetLocation,
      valueInputOption: 'USER_ENTERED',
      values: [bookFormatted]
    })
}

export async function deleteBook (sheetId, book) {
  const bookRow = parseInt(book.sheetLocation.substring(9))

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
