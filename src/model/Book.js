import { nanoid } from 'nanoid'

import { PUBLISHER_REPLACEMENTS } from '../services/lookup/Cbl'
import {
  ean as validateEan,
  isbn as validateIsbn,
  issn as validateIssn
} from '../util/validators'

import i18n from '../i18n'

const { n, locale } = i18n.global

export const Columns = {
  ID: 0,
  CODE: 1,
  GROUP: 2,
  TITLE: 3,
  AUTHORS: 4,
  PUBLISHER: 5,
  DIMENSIONS: 6,
  STATUS: 7,
  READ_AT: 8,
  LABEL_PRICE: 9,
  PAID_PRICE: 10,
  STORE: 11,
  COVER_URL: 12,
  BOUGHT_AT: 13,
  FAVORITE: 14,
  SYNOPSIS: 15,
  NOTES: 16,
  TAGS: 17,
  CREATED_AT: 18,
  UPDATED_AT: 19
}

export const CollectionColumns = {
  ID: 'B',
  CODE: 'C',
  GROUP: 'D',
  TITLE: 'E',
  AUTHORS: 'F',
  PUBLISHER: 'G',
  DIMENSIONS: 'H',
  STATUS: 'I',
  READ_AT: 'J',
  LABEL_PRICE: 'K',
  PAID_PRICE: 'L',
  STORE: 'M',
  COVER_URL: 'N',
  BOUGHT_AT: 'O',
  FAVORITE: 'P',
  SYNOPSIS: 'Q',
  NOTES: 'R',
  TAGS: 'S',
  CREATED_AT: 'T',
  UPDATED_AT: 'U'
}

export const PropertyToColumn = {
  title: CollectionColumns.TITLE,
  publisher: CollectionColumns.PUBLISHER,
  status: CollectionColumns.STATUS,
  'paidPrice.value': CollectionColumns.PAID_PRICE,
  'labelPrice.value': CollectionColumns.LABEL_PRICE,
  boughtAt: CollectionColumns.BOUGHT_AT,
  readAt: CollectionColumns.READ_AT,
  createdAt: CollectionColumns.CREATED_AT,
  updatedAt: CollectionColumns.UPDATED_AT
}

export const BookStatus = {
  READ: 'READ',
  UNREAD: 'UNREAD'
}

export const BookFavorite = {
  ACTIVE: 'YES',
  INACTIVE: ''
}

export const NSFW_TAGS = ['nsfw', '18+', '+18', 'hentai', 'doujinshi', 'erótico']

export function parseBook (value, index) {
  const labelPrice = value[Columns.LABEL_PRICE].split(' ')
  const paidPrice = value[Columns.PAID_PRICE].split(' ')

  return {
    sheetLocation: `Collection!B${index + 5}`,
    id: value[Columns.ID],
    code: value[Columns.CODE],
    codeType: getCodeType(value[Columns.CODE]),
    group: value[Columns.GROUP],
    title: value[Columns.TITLE],
    titleParts: splitTitle(value[Columns.TITLE]),
    authors: value[Columns.AUTHORS].split(/;\s+/g),
    authorsStr: value[Columns.AUTHORS],
    publisher: value[Columns.PUBLISHER],
    dimensions: value[Columns.DIMENSIONS]
      .split(' × ')
      .map(measure => parseFloat(measure)),
    status: value[Columns.STATUS],
    readAt: value[Columns.READ_AT].length > 0
      ? new Date(value[Columns.READ_AT])
      : null,
    labelPrice: {
      currency: labelPrice[0],
      value: labelPrice[1] ? parseFloat(labelPrice[1]) : 0.0
    },
    paidPrice: {
      currency: paidPrice[0],
      value: paidPrice[1] ? parseFloat(paidPrice[1]) : 0.0
    },
    labelPriceCurrency: labelPrice[0],
    labelPriceValue: labelPrice[1] ? parseFloat(labelPrice[1]) : 0.0,
    paidPriceCurrency: paidPrice[0],
    paidPriceValue: paidPrice[1] ? parseFloat(paidPrice[1]) : 0.0,
    store: value[Columns.STORE],
    coverUrl: value[Columns.COVER_URL],
    boughtAt: value[Columns.BOUGHT_AT].length > 0
      ? new Date(value[Columns.BOUGHT_AT])
      : null,
    favorite: value[Columns.FAVORITE],
    synopsis: value[Columns.SYNOPSIS],
    notes: value[Columns.NOTES],
    tags: value[Columns.TAGS].length > 0
      ? value[Columns.TAGS].split(/,\s*/).map(t => t.toUpperCase())
      : [],
    createdAt: new Date(value[Columns.CREATED_AT]),
    updatedAt: new Date(value[Columns.UPDATED_AT])
  }
}

export function parseBookFromDataTable (dataTable, idMap, i) {
  function getProperty (column) {
    return dataTable.getValue(i, column)
  }

  const id = getProperty(Columns.ID)
  const labelPrice = getProperty(Columns.LABEL_PRICE).split(' ')
  const paidPrice = getProperty(Columns.PAID_PRICE).split(' ')

  return {
    sheetLocation: `Collection!B${idMap[id]}`,
    id,
    code: getProperty(Columns.CODE),
    codeType: getCodeType(getProperty(Columns.CODE)),
    group: getProperty(Columns.GROUP),
    title: getProperty(Columns.TITLE),
    titleParts: splitTitle(getProperty(Columns.TITLE)),
    authors: getProperty(Columns.AUTHORS).split(/;\s+/g),
    authorsStr: getProperty(Columns.AUTHORS),
    publisher: getProperty(Columns.PUBLISHER),
    dimensions: getProperty(Columns.DIMENSIONS)
      .split(' × ')
      .map(measure => parseFloat(measure)),
    status: getProperty(Columns.STATUS),
    readAt: getProperty(Columns.READ_AT),
    labelPrice: {
      currency: labelPrice[0],
      value: labelPrice[1] ? parseFloat(labelPrice[1]) : 0.0
    },
    paidPrice: {
      currency: paidPrice[0],
      value: paidPrice[1] ? parseFloat(paidPrice[1]) : 0.0
    },
    labelPriceCurrency: labelPrice[0],
    labelPriceValue: labelPrice[1] ? parseFloat(labelPrice[1]) : 0.0,
    paidPriceCurrency: paidPrice[0],
    paidPriceValue: paidPrice[1] ? parseFloat(paidPrice[1]) : 0.0,
    store: getProperty(Columns.STORE),
    coverUrl: getProperty(Columns.COVER_URL) || '',
    boughtAt: getProperty(Columns.BOUGHT_AT),
    favorite: getProperty(Columns.FAVORITE) || '',
    synopsis: getProperty(Columns.SYNOPSIS) || '',
    notes: getProperty(Columns.NOTES) || '',
    tags: getProperty(Columns.TAGS)
      ? getProperty(Columns.TAGS).split(/,\s*/).map(t => t.toUpperCase())
      : [],
    createdAt: getProperty(Columns.CREATED_AT),
    updatedAt: getProperty(Columns.UPDATED_AT)
  }
}

function formatDateToSheet (date) {
  return `=DATE(${date.getUTCFullYear()}, ${date.getUTCMonth() + 1}, ${date.getUTCDate()})`
}

function formatDateTimeToSheet (date) {
  return formatDateToSheet(date) + ' + ' +
    `TIME(${date.getUTCHours()}, ${date.getUTCMinutes()}, ${date.getUTCSeconds()})`
}

function fixDate (date, timezoneOffset) {
  if (date) {
    date.setMinutes(date.getMinutes() - timezoneOffset)
  }

  return date
}

export function formatBook (book) {
  const now = new Date()
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset())

  const offset = now.getTimezoneOffset()

  return [
    book.id || nanoid(),
    book.code,
    book.group,
    book.title,
    book.authors.join('; '),
    book.publisher,
    book.dimensions
      .map(dimension => n(dimension, 'dimensions', 'en-US'))
      .join(' × '),
    book.status || BookStatus.UNREAD,
    book.readAt ? formatDateToSheet(fixDate(book.readAt, offset)) : '',
    book.labelPrice.currency + ' ' +
      n(book.labelPrice.value, 'decimal', 'en-US'),
    book.paidPrice.currency + ' ' +
      n(book.paidPrice.value, 'decimal', 'en-US'),
    book.store,
    book.coverUrl || '',
    book.boughtAt ? formatDateToSheet(fixDate(book.boughtAt, offset)) : '',
    book.favorite || BookFavorite.INACTIVE,
    book.synopsis || '',
    book.notes || '',
    book.tags ? book.tags.join(', ').toUpperCase() : '',
    formatDateTimeToSheet(fixDate(book.createdAt, offset) || now),
    formatDateTimeToSheet(now)
  ]
}

export function splitTitle (title) {
  const titleRegex = /\s+#(\d+(?:[.,]\d+)?)(?::\s+)?/
  const parts = title.split(titleRegex)

  const main = parts[2]
    ? title.substring(0, title.indexOf(parts[2]) - 2).trim()
    : title

  return {
    title: parts[0].trim(),
    number: parts[1] || null,
    main,
    subtitle: parts[2]
      ? title.replace(main, '').replace(':', '').trim()
      : null
  }
}

export function getCodeType (code) {
  code = code.replace(/-/g, '')

  if (validateIsbn(code)) {
    return 'ISBN-' + code.length
  }

  if (validateIssn(code)) {
    return 'ISSN'
  }

  if (validateEan(code)) {
    return 'EAN-13'
  }

  return code !== 'N/A' ? 'ID' : 'N/A'
}

export function parseBookFromCbl (cblBook) {
  const allowedRoles = ['Autor', 'Ilustrador', 'Roteirista']

  const dimensions = cblBook.Dimensao
    ? cblBook.Dimensao.match(/(\d{2})(\d)?x(\d{2})(\d)?$/)
    : null

  const book = {
    code: cblBook.RowKey,
    codeType: cblBook.RowKey.length === 13 ? 'ISBN-13' : 'ISBN-10',
    title: cblBook.Title.trim()
      .replace(/(?::| -)? ?(?:v|vol|volume)?(?:\.|:)? ?(\d+)$/i, ' #$1')
      .replace(/#(\d{1})$/, '#0$1'),
    authors: cblBook.Profissoes && cblBook.Profissoes.length >= cblBook.Authors.length
      ? cblBook.Authors.filter((_, i) => allowedRoles.includes(cblBook.Profissoes[i]))
      : cblBook.Authors,
    authorsStr: '',
    publisher: PUBLISHER_REPLACEMENTS[cblBook.Imprint] || cblBook.Imprint,
    dimensions: dimensions
      ? [
          parseFloat(dimensions[1] + (dimensions[2] ? '.' + dimensions[2] : '')),
          parseFloat(dimensions[3] + (dimensions[4] ? '.' + dimensions[4] : ''))
        ]
      : [],
    dimensionsStr: '',
    synopsis: cblBook.Sinopse || '',
    provider: 'CBL'
  }

  book.authorsStr = book.authors.join('; ')

  book.dimensionsStr = book.dimensions
    .map(dm => n(dm, 'dimensions'))
    .join(' x ')

  return book
}

export function parseBookFromOpenLibrary (openLibraryBook, details) {
  const code = openLibraryBook.identifiers.isbn_13
    ? openLibraryBook.identifiers.isbn_13[0]
    : openLibraryBook.identifiers.isbn_10[0]

  let book = {
    code,
    codeType: code.length === 13 ? 'ISBN-13' : 'ISBN-10',
    title: openLibraryBook.title.trim()
      .replace(/(?::| -)? ?(?:v|vol|volume)?(?:\.|:)? ?(\d+)$/i, ' #$1')
      .replace(/#(\d{1})$/, '#0$1'),
    authors: (openLibraryBook.authors || []).map(author => author.name),
    authorsStr: '',
    publisher: openLibraryBook.publishers.length > 0 ? openLibraryBook.publishers[0].name : '',
    coverUrl: openLibraryBook.cover ? openLibraryBook.cover.large : '',
    provider: 'Open Library'
  }

  book.authorsStr = book.authors.join('; ')

  if (details) {
    const physicalDimensions = details.physical_dimensions || ''
    const dimensions = physicalDimensions
      .replace(' centimeters', '')
      .split(' x ')
      .map(parseFloat)
      .filter(dm => !isNaN(dm))

    book = {
      ...book,
      synopsis: details.description?.type === '/type/text'
        ? details.description.value
        : '',
      dimensions: physicalDimensions.includes('centimeters') && dimensions.length === 3
        ? dimensions.slice(0, 2).reverse()
        : [],
      dimensionsStr: physicalDimensions.includes('centimeters') && dimensions.length === 3
        ? (dimensions.slice(0, 2)
            .reverse()
            .map(dm => n(dm, 'dimensions'))
            .join(' x '))
        : ''
    }
  }

  return book
}

export function parseBookFromGoogleBooks (googleBook) {
  const volumeInfo = googleBook.volumeInfo
  const isbn13 = (volumeInfo.industryIdentifiers || [])
    .find(identifier => identifier.type === 'ISBN_13')
  const isbn10 = (volumeInfo.industryIdentifiers || [])
    .find(identifier => identifier.type === 'ISBN_10')

  const width = volumeInfo.dimensions
    ? parseFloat(volumeInfo.dimensions.width.replace(/\s(.*)$/, ''))
    : null
  const height = volumeInfo.dimensions
    ? parseFloat(volumeInfo.dimensions.height.replace(/\s(.*)$/, ''))
    : null

  return {
    code: isbn13 ? isbn13.identifier : isbn10.identifier,
    codeType: isbn13 ? 'ISBN-13' : 'ISBN-10',
    title: volumeInfo.title.trim()
      .replace(/(?::| -)? ?(?:v|vol|volume)?(?:\.|:)? ?(\d+)$/i, ' #$1')
      .replace(/#(\d{1})$/, '#0$1'),
    authors: volumeInfo.authors || [],
    authorsStr: volumeInfo.authors ? volumeInfo.authors.join('; ') : '',
    publisher: volumeInfo.publisher || '',
    synopsis: volumeInfo.description || '',
    dimensions: width && height
      ? [width, height]
      : [],
    dimensionsStr: width && height
      ? `${n(width, 'dimensions')} x ${n(height, 'dimensions')}`
      : '',
    provider: 'Google Books'
  }
}

export function bookCompare (a, b) {
  return a.group.localeCompare(b.group, locale.value) ||
    a.titleParts[0].localeCompare(b.titleParts[0], locale.value) ||
    a.publisher.localeCompare(b.publisher, locale.value) ||
    (a.titleParts[1] || '01').localeCompare(b.titleParts[1] || '01', locale.value)
}
