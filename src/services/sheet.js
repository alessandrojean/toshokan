import dedent from 'dedent'

import i18n from '../i18n'

import {
  BookStatus,
  CollectionColumns,
  Columns,
  formatBook,
  parseBookFromDataTable
} from '@/model/Book'

const SHEET_FILE_NAME = 'Toshokan'
const SHEET_MIME_TYPE = 'application/vnd.google-apps.spreadsheet'
const SHEET_DEV_SUFFIX = '-dev'

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

export async function getSheetData (sheetId) {
  const response = await window.gapi.client.sheets.spreadsheets.values
    .batchGet({
      spreadsheetId: sheetId,
      ranges: [
        'TotalItems',
        'Expense',
        'Reading',
        'MonthlyStatistics',
        'AuthorRank',
        'SeriesRank',
        'PublisherRank',
        'Currency'
      ]
    })

  const stats = {
    count: parseInt(response.result.valueRanges[0].values[0][0]),
    money: {
      totalSpentLabel: parseFloat(response.result.valueRanges[1].values[0][1]),
      totalSpentPaid: parseFloat(response.result.valueRanges[1].values[1][1]),
      saved: parseFloat(response.result.valueRanges[1].values[2][1]),
      percent: parseFloat(response.result.valueRanges[1].values[3][1]),
      currency: response.result.valueRanges[7].values[0][0]
    },
    status: {
      read: parseInt(response.result.valueRanges[2].values[0][1], 10),
      unread: parseInt(response.result.valueRanges[2].values[1][1], 10),
      percent: parseFloat(response.result.valueRanges[2].values[2][1], 10)
    },
    monthly: (response.result.valueRanges[3].values || [])
      .slice(0, 10)
      .reverse()
      .filter(row => row[0].length > 0)
      .map(row => ({
        month: new Date(`${row[0]}-02`),
        totalSpent: parseFloat(row[1]),
        count: parseInt(row[2], 10),
        read: parseInt(row[3], 10)
      })),
    authors: (response.result.valueRanges[4].values || [])
      .slice(0, 10)
      .map(row => ({ name: row[0], count: parseInt(row[1], 10) })),
    series: (response.result.valueRanges[5].values || [])
      .slice(0, 10)
      .map(row => ({ name: row[0], count: parseInt(row[1], 10) })),
    imprints: (response.result.valueRanges[6].values || [])
      .slice(0, 10)
      .map(row => ({ name: row[0], count: parseInt(row[1], 10) }))
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

  return { stats, timeZone }
}

const COLLECTION_RANGE = 'B4:T'
const COLLECTION_SHEET = 'Collection'
const PER_PAGE = 18

function buildSheetUrl (sheetId) {
  const sheetUrl = new URL(`https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq`)

  sheetUrl.searchParams.append('range', COLLECTION_RANGE)
  sheetUrl.searchParams.append('sheet', COLLECTION_SHEET)
  sheetUrl.searchParams.append('headers', '1')
  sheetUrl.searchParams.append('access_token', window.gapi.auth.getToken().access_token)

  return sheetUrl.href
}

export function getBooks (sheetId, idMap, page = 1, options = {}) {
  const sheetUrl = buildSheetUrl(sheetId)

  const offset = (page - 1) * PER_PAGE
  const orderBy = options.orderBy || CollectionColumns.CREATED_AT
  const orderDirection = options.orderDirection || 'desc'
  const limit = options.limit || PER_PAGE

  const where = options.group
    ? `where ${CollectionColumns.COLLECTION} = "${options.group}"`
    : ''

  const query = new window.google.visualization.Query(sheetUrl)
  query.setQuery(dedent`
    select * ${where}
    order by ${orderBy} ${orderDirection}
    limit ${limit} offset ${offset}
  `)

  return new Promise((resolve, reject) => {
    query.send(response => {
      if (response.isError()) {
        reject(new Error('Error in query: ' + response.getMessage()))
        return
      }

      const dataTable = response.getDataTable()

      const rows = dataTable.getNumberOfRows()
      const books = []

      for (let i = 0; i < rows; i++) {
        books.push(parseBookFromDataTable(dataTable, idMap, i))
      }

      resolve(books)
    })
  })
}

export async function getLatestReadings (sheetId, idMap, options = {}) {
  const sheetUrl = buildSheetUrl(sheetId)

  const limit = options.limit || PER_PAGE

  const query = new window.google.visualization.Query(sheetUrl)
  query.setQuery(dedent`
    select *
    where ${CollectionColumns.READ_AT} is not null
      and ${CollectionColumns.STATUS} = "${BookStatus.READ}"
    order by ${CollectionColumns.READ_AT} desc
    limit ${limit}
  `)

  return new Promise((resolve, reject) => {
    query.send(response => {
      if (response.isError()) {
        reject(new Error('Error in query: ' + response.getMessage()))
        return
      }

      const dataTable = response.getDataTable()

      const rows = dataTable.getNumberOfRows()
      const books = []

      for (let i = 0; i < rows; i++) {
        books.push(parseBookFromDataTable(dataTable, idMap, i))
      }

      resolve(books)
    })
  })
}

export async function getBooksFromGroup (sheetId, idMap, group, page = 1, options = {}) {
  const books = await getBooks(sheetId, idMap, page, { ...options, group })

  const sheetUrl = buildSheetUrl(sheetId)
  const query = new window.google.visualization.Query(sheetUrl)
  query.setQuery(dedent`
    select count(${CollectionColumns.COLLECTION})
    where ${CollectionColumns.COLLECTION} = "${group}"
  `)

  return new Promise((resolve, reject) => {
    query.send(response => {
      if (response.isError()) {
        reject(new Error('Error in query: ' + response.getMessage()))
        return
      }

      const dataTable = response.getDataTable()
      const totalResults = dataTable.getValue(0, 0)

      resolve({ books, totalResults })
    })
  })
}

export function getBookIds (sheetId) {
  const sheetUrl = buildSheetUrl(sheetId)

  const query = new window.google.visualization.Query(sheetUrl)
  query.setQuery(dedent`
    select ${CollectionColumns.ID}
  `)

  return new Promise((resolve, reject) => {
    query.send(response => {
      if (response.isError()) {
        reject(new Error('Error in query: ' + response.getMessage()))
        return
      }

      const dataTable = response.getDataTable()

      const rows = dataTable.getNumberOfRows()

      if (rows === 0) {
        resolve({})
        return
      }

      const ids = {}

      for (let i = 0; i < rows; i++) {
        const id = dataTable.getValue(i, 0)
        ids[id] = i + 5
      }

      resolve(ids)
    })
  })
}

export function getBookById (sheetId, idMap, id) {
  const sheetUrl = buildSheetUrl(sheetId)

  const query = new window.google.visualization.Query(sheetUrl)
  query.setQuery(dedent`
    select *
    where ${CollectionColumns.ID} = "${id}"
    limit 1
  `)

  return new Promise((resolve, reject) => {
    query.send(response => {
      if (response.isError()) {
        reject(new Error('Error in query: ' + response.getMessage()))
        return
      }

      const dataTable = response.getDataTable()

      const rows = dataTable.getNumberOfRows()

      if (rows === 0) {
        resolve(null)
        return
      }

      resolve(parseBookFromDataTable(dataTable, idMap, 0))
    })
  })
}

export function getBooksFromCollection (sheetId, idMap, book) {
  const sheetUrl = buildSheetUrl(sheetId)

  const query = new window.google.visualization.Query(sheetUrl)
  query.setQuery(dedent`
    select *
    where ${CollectionColumns.TITLE} starts with "${book.titleParts[0]}"
      and ${CollectionColumns.IMPRINT} = "${book.imprint}"
    order by ${CollectionColumns.TITLE} asc
  `)

  return new Promise((resolve, reject) => {
    query.send(response => {
      if (response.isError()) {
        reject(new Error('Error in query: ' + response.getMessage()))
        return
      }

      const dataTable = response.getDataTable()
      const rows = dataTable.getNumberOfRows()
      const books = []

      if (rows < 2) {
        resolve(books)
        return
      }

      for (let i = 0; i < rows; i++) {
        books.push(parseBookFromDataTable(dataTable, idMap, i))
      }

      resolve(books)
    })
  })
}

export function getBookNeighbors (sheetId, idMap, book) {
  const sheetUrl = buildSheetUrl(sheetId)

  const query = new window.google.visualization.Query(sheetUrl)
  query.setQuery(dedent`
    select *
    where ${CollectionColumns.TITLE} starts with "${book.titleParts[0]}"
      and ${CollectionColumns.IMPRINT} = "${book.imprint}"
    order by ${CollectionColumns.TITLE} asc
  `)

  return new Promise((resolve, reject) => {
    query.send(response => {
      if (response.isError()) {
        reject(new Error('Error in query: ' + response.getMessage()))
        return
      }

      const dataTable = response.getDataTable()

      const rows = dataTable.getNumberOfRows()

      if (rows === 1) {
        resolve(null)
        return
      }

      let bookRow = 0

      for (let i = 0; i < rows; i++) {
        if (dataTable.getValue(i, Columns.TITLE) === book.title) {
          bookRow = i
          break
        }
      }

      const previous = bookRow > 0
        ? parseBookFromDataTable(dataTable, idMap, bookRow - 1)
        : null

      const next = bookRow < rows - 1
        ? parseBookFromDataTable(dataTable, idMap, bookRow + 1)
        : null

      resolve({ previous, next })
    })
  })
}

export function getColumnUniqueValues (sheetId, column, alphabetically) {
  const sheetUrl = buildSheetUrl(sheetId)

  const orderBy = alphabetically
    ? `${column} asc`
    : `count(${column}) desc, ${column} asc`

  const query = new window.google.visualization.Query(sheetUrl)
  query.setQuery(dedent`
    select ${column}, count(${column})
    group by ${column}
    order by ${orderBy}
  `)

  return new Promise((resolve, reject) => {
    query.send(response => {
      if (response.isError()) {
        reject(new Error('Error in query: ' + response.getMessage()))
        return
      }

      const dataTable = response.getDataTable()

      const rows = dataTable.getNumberOfRows()
      const values = []

      for (let i = 0; i < rows; i++) {
        values.push({
          name: dataTable.getValue(i, 0),
          count: dataTable.getValue(i, 1)
        })
      }

      resolve(values)
    })
  })
}

export async function getGroups (sheetId) {
  return await getColumnUniqueValues(sheetId, CollectionColumns.COLLECTION)
}

export async function getImprints (sheetId) {
  return await getColumnUniqueValues(sheetId, CollectionColumns.IMPRINT, true)
}

export async function getStores (sheetId) {
  return await getColumnUniqueValues(sheetId, CollectionColumns.STORE, true)
}

export function searchBooks (sheetId, idMap, searchTerm) {
  const sheetUrl = buildSheetUrl(sheetId)

  const searchRegex = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .toLowerCase()

  searchTerm = searchTerm
    .toLowerCase()

  const query = new window.google.visualization.Query(sheetUrl)
  query.setQuery(dedent`
    select *
    where lower(${CollectionColumns.TITLE}) matches ".*${searchRegex}.*"
      or lower(${CollectionColumns.AUTHORS}) matches ".*${searchRegex}.*"
      or ${CollectionColumns.ID} = "${searchTerm}"
      or ${CollectionColumns.CODE} = "${searchTerm}"
    order by ${CollectionColumns.CREATED_AT} desc
    limit 10
  `)

  return new Promise((resolve, reject) => {
    query.send(response => {
      if (response.isError()) {
        reject(new Error('Error in query: ' + response.getMessage()))
        return
      }

      const dataTable = response.getDataTable()

      const rows = dataTable.getNumberOfRows()
      const books = []

      for (let i = 0; i < rows; i++) {
        books.push(parseBookFromDataTable(dataTable, idMap, i))
      }

      resolve(books)
    })
  })
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
