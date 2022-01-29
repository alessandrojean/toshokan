import { nanoid } from 'nanoid'

import { PUBLISHER_REPLACEMENTS } from '../services/lookup/Cbl'
import {
  ean as validateEan,
  isbn as validateIsbn,
  issn as validateIssn
} from '../util/validators'

import i18n from '@/i18n'
import { decimalComma } from '@/util/validators'

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

export const STATUS_READ = 'READ'
export const STATUS_UNREAD = 'UNREAD'
export const STATUS_FUTURE = 'FUTURE'

export const FAVORITE_ACTIVE = 'YES'
export const FAVORITE_INACTIVE = ''

const NSFW_TAGS = ['nsfw', '18+', '+18', 'hentai', 'doujinshi', 'erótico']

const CBL_ALLOWED_ROLES = ['Autor', 'Ilustrador', 'Roteirista']

const monetaryValidator = decimalComma(2)

export default class Book {
  /** @type {?string} */
  sheetLocation = null

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

  /** @type {?object} */
  dimensions = null

  /** @type {?string} */
  status = null

  /** @type {?Date} */
  readAt = null

  /** @type {?object} */
  labelPrice = null

  /** @type {?object} */
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
   * @type {object}
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
   *
   * @type {string}
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
    // return (this.dimensions?.filter(dm => dm && !isNaN(dm)) || [])
    //   .map(dm => n(dm, 'dimensions'))
    //   .join(' x ')
  }

  /** @type {string} */
  get boughtAtStr () {
    return this.boughtAt ? this.boughtAt.toISOString().substring(0, 10) : ''
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
   * @returns {any[]}
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
      this.labelPrice.currency + ' ' +
        n(this.labelPrice.value, 'decimal', 'en-US'),
      this.paidPrice.currency + ' ' +
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
   * @returns {Book}
   */
  static fromDataTable (dataTable, idMap, i) {
    function getProperty (column) {
      return dataTable.getValue(i, column)
    }

    const id = getProperty(Columns.ID)
    const labelPrice = getProperty(Columns.LABEL_PRICE).split(' ')
    const paidPrice = getProperty(Columns.PAID_PRICE).split(' ')
    const dimensions = getProperty(Columns.DIMENSIONS).split(' × ')

    return new Book({
      sheetLocation: `Collection!B${idMap[id]}`,
      id,
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
        currency: labelPrice[0],
        value: labelPrice[1] ? parseFloat(labelPrice[1]) : 0.0
      },
      paidPrice: {
        currency: paidPrice[0],
        value: paidPrice[1] ? parseFloat(paidPrice[1]) : 0.0
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
   * @returns {Book}
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
   * @returns {Book}
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
   * @returns {Book}
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
        synopsis: details.description?.type === '/type/text'
          ? details.description.value
          : '',
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
   * @returns {string} The type of the code
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
