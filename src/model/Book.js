import { nanoid } from 'nanoid'

import { PUBLISHER_REPLACEMENTS } from '../services/lookup/Cbl'
import {
  ean as validateEan,
  isbn as validateIsbn,
  issn as validateIssn
} from '../util/validators'

import i18n from '@/i18n'
import { decimalComma } from '@/util/validators'
import { getIsbnCountry } from '@/util/isbn'

const { n, locale } = i18n.global

export const Columns = {
  ROW: 0,
  ID: 1,
  CODE: 2,
  GROUP: 3,
  TITLE: 4,
  AUTHORS: 5,
  PUBLISHER: 6,
  DIMENSIONS: 7,
  STATUS: 8,
  READ_AT: 9,
  LABEL_PRICE_CURRENCY: 10,
  LABEL_PRICE_VALUE: 11,
  PAID_PRICE_CURRENCY: 12,
  PAID_PRICE_VALUE: 13,
  STORE: 14,
  COVER_URL: 15,
  BOUGHT_AT: 16,
  FAVORITE: 17,
  SYNOPSIS: 18,
  NOTES: 19,
  TAGS: 20,
  CREATED_AT: 21,
  UPDATED_AT: 22
}

export const CollectionColumns = {
  ROW: 'B',
  ID: 'C',
  CODE: 'D',
  GROUP: 'E',
  TITLE: 'F',
  AUTHORS: 'G',
  PUBLISHER: 'H',
  DIMENSIONS: 'I',
  STATUS: 'J',
  READ_AT: 'K',
  LABEL_PRICE_CURRENCY: 'L',
  LABEL_PRICE_VALUE: 'M',
  PAID_PRICE_CURRENCY: 'N',
  PAID_PRICE_VALUE: 'O',
  STORE: 'P',
  COVER_URL: 'Q',
  BOUGHT_AT: 'R',
  FAVORITE: 'S',
  SYNOPSIS: 'T',
  NOTES: 'U',
  TAGS: 'V',
  CREATED_AT: 'W',
  UPDATED_AT: 'X'
}

export const PropertyToColumn = {
  title: CollectionColumns.TITLE,
  publisher: CollectionColumns.PUBLISHER,
  status: CollectionColumns.STATUS,
  'paidPrice.value': CollectionColumns.PAID_PRICE_VALUE,
  'labelPrice.value': CollectionColumns.LABEL_PRICE_VALUE,
  boughtAt: CollectionColumns.BOUGHT_AT,
  readAt: CollectionColumns.READ_AT,
  createdAt: CollectionColumns.CREATED_AT,
  updatedAt: CollectionColumns.UPDATED_AT
}

export const STATUS_READ = 'READ'
export const STATUS_UNREAD = 'UNREAD'
export const STATUS_FUTURE = 'FUTURE'

export const FAVORITE_ACTIVE = 'YES'
export const FAVORITE_INACTIVE = ''

const NSFW_TAGS = ['nsfw', '18+', '+18', 'hentai', 'doujinshi', 'erótico']

const CBL_ALLOWED_ROLES = ['Autor', 'Ilustrador', 'Roteirista']

const monetaryValidator = decimalComma(2)

/**
 * A book in the sheet.
 */
export default class Book {
  /** @type {?string} */
  sheetLocation = null

  /** @type {?number} */
  row = -1

  /** @type {?string} */
  id = null

  /** @type {?string} */
  code = null

  /** @type {?string} */
  group = null

  /** @type {?string} */
  title = null

  /** @type {?string[]} */
  authors = null

  /** @type {?string} */
  publisher = null

  /** @type {{ width: number, height: number } | null} */
  dimensions = null

  /** @type {?string} */
  status = null

  /** @type {?Date} */
  readAt = null

  /** @type {{ currency: string, value: number, valueStr: string } | null} */
  labelPrice = null

  /** @type {{ currency: string, value: number, valueStr: string } | null} */
  paidPrice = null

  /** @type {?string} */
  store = null

  /** @type {?string} */
  coverUrl = null

  /** @type {?Date} */
  boughtAt = null

  /** @type {?boolean} */
  favorite = null

  /** @type {?string} */
  synopsis = null

  /** @type {?string} */
  notes = null

  /** @type {string[]} */
  tags = []

  /** @type {?string} */
  provider = null

  /** @type {?Date} */
  createdAt = null

  /** @type {?Date} */
  updatedAt = null

  /**
   * Create a new book instance.
   *
   * @param {Partial<Book>} properties Object with the book properties.
   */
  constructor (properties) {
    Object.assign(this, properties)
  }

  /**
   * Splits the title into the needed parts.
   *
   * @type {{ title: string, number: string?, main: string, subtitle: string? }}
   */
  get titleParts () {
    const titleRegex = /\s+#(\d+(?:[.,]\d+)?)(?::\s+)?/
    const parts = this.title.split(titleRegex)

    const main = parts[2]
      ? this.title.substring(0, this.title.indexOf(parts[2]) - 2).trim()
      : this.title

    return {
      title: parts[0].trim(),
      number: parts[1] || null,
      main,
      subtitle: parts[2]
        ? this.title.replace(main, '').replace(':', '').trim()
        : null
    }
  }

  /**
   * The type of the book barcode.
   */
  get codeType () {
    return Book.getCodeType(this.code)
  }

  /**
   * The authors joined in a single string.
   *
   * @type {string}
   */
  get authorsStr () {
    return this.authors.join('; ')
  }

  /**
   * Returns true if the book has a NSFW tag.
   *
   * @type {boolean}
   */
  get isNsfw () {
    return this.tags.some(tag => NSFW_TAGS.includes(tag.toLowerCase()))
  }

  /**
   * Returns true if the book was read.
   *
   * @type {boolean}
   */
  get isRead () {
    return this.status === STATUS_READ
  }

  /**
   * Returns true if the book is a future item.
   *
   * @type {boolean}
   */
  get isFuture () {
    return this.status === STATUS_FUTURE
  }

  /** @type {string} */
  get labelPriceValueStr () {
    return (this.labelPrice?.value && monetaryValidator(this.labelPrice.value))
      ? n(this.labelPrice.value, 'decimal')
      : ''
  }

  /** @type {string} */
  get paidPriceValueStr () {
    return (this.paidPrice?.value && monetaryValidator(this.paidPrice.value))
      ? n(this.paidPrice.value, 'decimal')
      : ''
  }

  /** @type {string} */
  get dimensionsStr () {
    if (!this.dimensions?.width || !this.dimensions?.height) {
      return ''
    }

    const width = isNaN(this.dimensions.width)
      ? ''
      : n(this.dimensions.width)
    const height = isNaN(this.dimensions.height)
      ? ''
      : n(this.dimensions.height)

    return `${width} x ${height}`
  }

  /** @type {string} */
  get boughtAtStr () {
    return this.boughtAt ? this.boughtAt.toISOString().substring(0, 10) : ''
  }

  /**
   * The ISBN information.
   *
   * @type {{ countryCode: string, locale: string, flagUrl: string } | null}
   */
  get isbnData () {
    if (!this.codeType.includes('ISBN')) {
      return null
    }

    return getIsbnCountry(this.code)
  }

  /**
   * Compares this book with b.
   *
   * @param {Book} b The other book to compare
   * @returns {number}
   */
  compare (b) {
    return this.group.localeCompare(b.group, locale.value) ||
      this.titleParts[0].localeCompare(b.titleParts[0], locale.value) ||
      this.publisher.localeCompare(b.publisher, locale.value) ||
      (this.titleParts[1] || '01').localeCompare(b.titleParts[1] || '01', locale.value)
  }

  /**
   * Formats the book as a proper array to be inserted in the sheet.
   *
   * @returns {string[]}
   */
  toArray () {
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

    const now = new Date()
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset())

    const offset = now.getTimezoneOffset()

    return [
      '=ROW()',
      this.id || nanoid(),
      this.code,
      this.group,
      this.title,
      this.authorsStr,
      this.publisher,
      n(this.dimensions.width, 'dimensions', 'en-US') +
        ' × ' + n(this.dimensions.height, 'dimensions', 'en-US'),
      this.status || STATUS_UNREAD,
      this.readAt ? formatDateToSheet(fixDate(this.readAt, offset)) : '',
      this.labelPrice.currency,
      n(this.labelPrice.value, 'decimal', 'en-US'),
      this.paidPrice.currency,
      n(this.paidPrice.value, 'decimal', 'en-US'),
      this.store,
      this.coverUrl || '',
      this.boughtAt ? formatDateToSheet(fixDate(this.boughtAt, offset)) : '',
      this.favorite ? FAVORITE_ACTIVE : FAVORITE_INACTIVE,
      this.synopsis || '',
      this.notes || '',
      this.tags ? this.tags.join(', ').toUpperCase() : '',
      formatDateTimeToSheet(fixDate(this.createdAt, offset) || now),
      formatDateTimeToSheet(now)
    ]
  }

  /**
   * Creates a book from a DataTable row.
   *
   * @param {google.visualization.DataTable} dataTable The dataTable to lookup
   * @param {number} i The row index
   * @returns {Book} The formatted book
   */
  static fromDataTable (dataTable, i) {
    function getProperty (column) {
      return dataTable.getValue(i, column)
    }

    const row = getProperty(Columns.ROW)
    const dimensions = getProperty(Columns.DIMENSIONS).split(' × ')

    return new Book({
      sheetLocation: `Collection!B${row}`,
      row,
      id: getProperty(Columns.ID),
      code: getProperty(Columns.CODE),
      group: getProperty(Columns.GROUP),
      title: getProperty(Columns.TITLE),
      authors: getProperty(Columns.AUTHORS).split(/;\s+/g),
      publisher: getProperty(Columns.PUBLISHER),
      dimensions: {
        width: parseFloat(dimensions[0]),
        height: parseFloat(dimensions[1])
      },
      status: getProperty(Columns.STATUS),
      readAt: getProperty(Columns.READ_AT),
      labelPrice: {
        currency: getProperty(Columns.LABEL_PRICE_CURRENCY),
        value: getProperty(Columns.LABEL_PRICE_VALUE)
      },
      paidPrice: {
        currency: getProperty(Columns.PAID_PRICE_CURRENCY),
        value: getProperty(Columns.PAID_PRICE_VALUE)
      },
      store: getProperty(Columns.STORE),
      coverUrl: getProperty(Columns.COVER_URL) || '',
      boughtAt: getProperty(Columns.BOUGHT_AT),
      favorite: getProperty(Columns.FAVORITE) === FAVORITE_ACTIVE,
      synopsis: getProperty(Columns.SYNOPSIS) || '',
      notes: getProperty(Columns.NOTES) || '',
      tags: getProperty(Columns.TAGS)
        ? getProperty(Columns.TAGS).split(/,\s*/).map(t => t.toUpperCase())
        : [],
      createdAt: getProperty(Columns.CREATED_AT),
      updatedAt: getProperty(Columns.UPDATED_AT)
    })
  }

  /**
   * Creates a book from a CBL record.
   *
   * @param {Object} cblBook The CBL record
   * @returns {Book} A formatted book
   */
  static fromCbl (cblBook) {
    const dimensions = cblBook.Dimensao
      ? cblBook.Dimensao.match(/(\d{2})(\d)?x(\d{2})(\d)?$/)
      : null

    return new Book({
      code: cblBook.RowKey,
      title: cblBook.Title.trim()
        .replace(/(?::| -)? ?(?:v|vol|volume)?(?:\.|:)? ?(\d+)$/i, ' #$1')
        .replace(/#(\d{1})$/, '#0$1'),
      authors: cblBook.Profissoes && cblBook.Profissoes.length >= cblBook.Authors.length
        ? cblBook.Authors.filter((_, i) => CBL_ALLOWED_ROLES.includes(cblBook.Profissoes[i]))
        : cblBook.Authors,
      publisher: PUBLISHER_REPLACEMENTS[cblBook.Imprint] || cblBook.Imprint,
      dimensions: dimensions
        ? {
            width: parseFloat(
              dimensions[1] + (dimensions[2] ? '.' + dimensions[2] : '')
            ),
            height: parseFloat(
              dimensions[3] + (dimensions[4] ? '.' + dimensions[4] : '')
            )
          }
        : null,
      synopsis: cblBook.Sinopse || '',
      provider: 'CBL'
    })
  }

  /**
   * Creates a book from a Google Book record.
   *
   * @param {Object} googleBook The Google Book record
   * @returns {Book} A formatted book
   */
  static fromGoogleBooks (googleBook) {
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

    return new Book({
      code: isbn13 ? isbn13.identifier : isbn10.identifier,
      title: volumeInfo.title.trim()
        .replace(/(?::| -)? ?(?:v|vol|volume)?(?:\.|:)? ?(\d+)$/i, ' #$1')
        .replace(/#(\d{1})$/, '#0$1'),
      authors: volumeInfo.authors || [],
      publisher: volumeInfo.publisher || '',
      synopsis: volumeInfo.description || '',
      dimensions: width && height ? { width, height } : null,
      provider: 'Google Books'
    })
  }

  /**
   * Creates a book from a Open Library record.
   *
   * @param {Object} openLibraryBook The Open Library record
   * @param {Object | null} details The record details
   * @returns {Book} A formatted book
   */
  static fromOpenLibrary (openLibraryBook, details) {
    const code = openLibraryBook.identifiers.isbn_13
      ? openLibraryBook.identifiers.isbn_13[0]
      : openLibraryBook.identifiers.isbn_10[0]

    const book = new Book({
      code,
      title: openLibraryBook.title.trim()
        .replace(/(?::| -)? ?(?:v|vol|volume)?(?:\.|:)? ?(\d+)$/i, ' #$1')
        .replace(/#(\d{1})$/, '#0$1'),
      authors: (openLibraryBook.authors || []).map(author => author.name),
      publisher: openLibraryBook.publishers.length > 0 ? openLibraryBook.publishers[0].name : '',
      coverUrl: openLibraryBook.cover ? openLibraryBook.cover.large : '',
      provider: 'Open Library'
    })

    if (details) {
      const physicalDimensions = details.physical_dimensions || ''
      const dimensions = physicalDimensions
        .replace(' centimeters', '')
        .split(' x ')
        .map(parseFloat)
        .filter(dm => !isNaN(dm))

      Object.assign(book, {
        synopsis: details.description || '',
        dimensions: physicalDimensions.includes('centimeters') && dimensions.length === 3
          ? {
              width: dimensions[1],
              height: dimensions[0]
            }
          : null
      })
    }

    return book
  }

  /**
   * Try to obtain the type of the barcode.
   *
   * @param {string} code The barcode of the book.
   * @returns {'ISBN-13' | 'ISBN-10' | 'ISSN' | 'EAN-13' | 'ID' | 'N/A'} The type of the code
   */
  static getCodeType (code) {
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
}
