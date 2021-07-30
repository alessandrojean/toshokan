import groupBy from 'lodash.groupby'
import uniqBy from 'lodash.uniqby'

import { bookCompare, formatBook, parseBook } from '@/model/Book'
import i18n from '../i18n'

const SHEET_FILE_NAME = 'Toshokan'
const SHEET_MIME_TYPE = 'application/vnd.google-apps.spreadsheet'
const SHEET_DEV_SUFFIX = '' // '-dev'

const { t } = i18n.global

export async function findSheetId () {
  // Use a development only sheet to prevent issues during tests.
  const fileName = SHEET_FILE_NAME +
    (process.env.NODE_ENV === 'development' ? SHEET_DEV_SUFFIX : '')

  const response = await window.gapi.client.drive.files.list({
    q: `name='${fileName}' and mimeType='${SHEET_MIME_TYPE}'`,
    orderBy: 'starred'
  })

  if (response.result.files.length > 0) {
    return response.result.files[0].id
  }

  throw new Error(t('sheet.notFound'))
}

const COLLECTION_RANGE = 'Collection!B5:Q'
const TOTAL_RANGE = 'Statistics!C5'
const MONEY_RANGE = 'Statistics!C8:C11'
const STATUS_RANGE = 'Statistics!C14:C16'
const MONTHLY_RANGE = 'Statistics!E5:G'
const AUTHORS_RANGE = 'Statistics!I5:J'
const SERIES_RANGE = 'Statistics!L5:M'
const IMPRINTS_RANGE = 'Statistics!O5:P'
const CURRENCY_RANGE = 'Statistics!C20'

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
        IMPRINTS_RANGE,
        CURRENCY_RANGE
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
      totalSpentLabel: parseFloat(response.result.valueRanges[2].values[0][0]),
      totalSpentPaid: parseFloat(response.result.valueRanges[2].values[1][0]),
      saved: parseFloat(response.result.valueRanges[2].values[2][0]),
      percent: parseFloat(response.result.valueRanges[2].values[3][0]),
      currency: response.result.valueRanges[8].values[0][0]
    },
    status: {
      read: parseInt(response.result.valueRanges[3].values[0][0]),
      unread: parseInt(response.result.valueRanges[3].values[1][0]),
      percent: parseFloat(response.result.valueRanges[3].values[2][0])
    },
    monthly: (response.result.valueRanges[4].values || [])
      .slice(0, 10)
      .reverse()
      .map(row => ({
        month: new Date(`${row[0]}-01`),
        totalSpent: parseFloat(row[1]),
        count: parseInt(row[2])
      })),
    authors: (response.result.valueRanges[5].values || [])
      .slice(0, 10)
      .map(row => ({ name: row[0], count: parseInt(row[1]) })),
    series: (response.result.valueRanges[6].values || [])
      .slice(0, 10)
      .map(row => ({ name: row[0], count: parseInt(row[1]) })),
    imprints: (response.result.valueRanges[7].values || [])
      .slice(0, 10)
      .map(row => ({ name: row[0], count: parseInt(row[1]) })),
    itemsByCollection: Object.entries(collection)
      .map(entry => ({ collection: entry[0], items: entry[1].length }))
  }

  const propertiesResponse = await window.gapi.client.sheets.spreadsheets
    .get({
      spreadsheetId: sheetId,
      fields: 'properties.timeZone'
    })

  const timeZoneName = propertiesResponse.result.properties.timeZone
  const offset = parseInt(
    new Date()
      .toLocaleString('en-US', {
        timeZone: timeZoneName,
        timeZoneName: 'short',
        hour12: false
      })
      .replace(/.*GMT/, '')
  )

  const timeZone = {
    name: timeZoneName,
    offset,
    offsetStr: offset.toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      signDisplay: 'always'
    }) + ':00'
  }

  return {
    lastAdded,
    collection,
    imprints,
    stores,
    stats,
    timeZone
  }
}

export async function insertBook (sheetId, book) {
  const bookFormatted = formatBook(book)

  await window.gapi.client.sheets.spreadsheets.values
    .append({
      spreadsheetId: sheetId,
      range: 'Collection!B5',
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
