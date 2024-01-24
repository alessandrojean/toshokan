import { nanoid } from 'nanoid'

import { PUBLISHER_REPLACEMENTS } from '@/services/lookup/Cbl'
import {
  decimalComma,
  isbn as isValidIsbn,
  ean as validateEan
  , issn as validateIssn,
} from '@/util/validators'

import i18n from '@/i18n'
import { getIsbnCountry } from '@/util/isbn'
import { fixDate, formatDateTimeToSheet, formatDateToSheet } from '@/util/date'
import type { Sort } from '@/types'

import type {
  CblBook,
  GoogleBook,
  OpenLibraryBook,
  OpenLibraryBookDetails,
} from '@/services/lookup'

const { n, locale } = i18n.global

export enum Columns {
  ROW = 0,
  ID = 1,
  CODE = 2,
  GROUP = 3,
  TITLE = 4,
  AUTHORS = 5,
  PUBLISHER = 6,
  DIMENSIONS = 7,
  STATUS = 8,
  READ_AT = 9,
  LABEL_PRICE_CURRENCY = 10,
  LABEL_PRICE_VALUE = 11,
  PAID_PRICE_CURRENCY = 12,
  PAID_PRICE_VALUE = 13,
  STORE = 14,
  COVER_URL = 15,
  BOUGHT_AT = 16,
  FAVORITE = 17,
  SYNOPSIS = 18,
  NOTES = 19,
  TAGS = 20,
  CREATED_AT = 21,
  UPDATED_AT = 22,
}

export enum CollectionColumns {
  ROW = 'B',
  ID = 'C',
  CODE = 'D',
  GROUP = 'E',
  TITLE = 'F',
  AUTHORS = 'G',
  PUBLISHER = 'H',
  DIMENSIONS = 'I',
  STATUS = 'J',
  READ_AT = 'K',
  LABEL_PRICE_CURRENCY = 'L',
  LABEL_PRICE_VALUE = 'M',
  PAID_PRICE_CURRENCY = 'N',
  PAID_PRICE_VALUE = 'O',
  STORE = 'P',
  COVER_URL = 'Q',
  BOUGHT_AT = 'R',
  FAVORITE = 'S',
  SYNOPSIS = 'T',
  NOTES = 'U',
  TAGS = 'V',
  CREATED_AT = 'W',
  UPDATED_AT = 'X',
}

export const PropertyToColumn: Record<string, (string | [string, Sort])[]> = {
  'title': [CollectionColumns.TITLE],
  'publisher': [CollectionColumns.PUBLISHER],
  'status': [CollectionColumns.STATUS],
  'paidPrice.value': [
    [CollectionColumns.PAID_PRICE_CURRENCY, 'asc'],
    CollectionColumns.PAID_PRICE_VALUE,
  ],
  'labelPrice.value': [
    [CollectionColumns.LABEL_PRICE_CURRENCY, 'asc'],
    CollectionColumns.LABEL_PRICE_VALUE,
  ],
  'boughtAt': [CollectionColumns.BOUGHT_AT],
  'readAt': [CollectionColumns.READ_AT, CollectionColumns.UPDATED_AT],
  'createdAt': [CollectionColumns.CREATED_AT],
  'updatedAt': [CollectionColumns.UPDATED_AT],
}

export enum Status {
  READ = 'READ',
  UNREAD = 'UNREAD',
  FUTURE = 'FUTURE',
}

export const STATUS_READ = Status.READ
export const STATUS_UNREAD = Status.UNREAD
export const STATUS_FUTURE = Status.FUTURE

export enum Favorite {
  ACTIVE = 'YES',
  INACTIVE = '',
}

export const FAVORITE_ACTIVE = Favorite.ACTIVE
export const FAVORITE_INACTIVE = Favorite.INACTIVE

const NSFW_TAGS = ['nsfw', '18+', '+18', 'hentai', 'doujinshi', 'erótico']

const CBL_ALLOWED_ROLES = ['Autor', 'Ilustrador', 'Roteirista']

const monetaryValidator = decimalComma(2)

export interface Dimension {
  width: number
  height: number
}

export interface MonetaryValue {
  currency: string
  value: number
  valueStr?: string
}

export type EmptyMonetaryValue = Omit<MonetaryValue, 'value'> & {
  value: number | null
}

export type FilledBook = {
  [K in keyof Book]: NonNullable<Book[K]>
}

/**
 * A book in the sheet.
 */
export default class Book {
  sheetLocation: string | null = null

  row: number | null = -1

  id: string | null = null

  code: string | null = null

  group: string | null = null

  title: string | null = null

  authors: string[] | null = null

  publisher: string | null = null

  dimensions: Dimension | null = null

  status: Status | null = null

  readAt: Date | null = null

  labelPrice: MonetaryValue | null = null

  paidPrice: MonetaryValue | null = null

  store: string | null = null

  coverUrl: string | null = null

  boughtAt: Date | null = null

  favorite: boolean | null = null

  synopsis: string | null = null

  notes: string | null = null

  tags: string[] = []

  provider: string | null = null

  createdAt: Date | null = null

  updatedAt: Date | null = null

  /**
   * Create a new book instance.
   */
  constructor(properties?: Partial<Book>) {
    Object.assign(this, properties ?? {})
  }

  /**
   * Splits the title into the needed parts.
   */
  get titleParts() {
    const titleRegex = /\s+#(\d+(?:[.,]\d+)?)(?::\s+)?/
    const parts = this.title!.split(titleRegex)

    let main = parts[2]
      ? this.title!.substring(0, this.title!.indexOf(parts[2]) - 2).trim()
      : this.title!

    let subtitle = parts[2]
      ? this.title!.replace(main, '').replace(':', '').trim()
      : ''

    if (!parts[1]) {
      const [title, ...rest] = this.title!.split(':')

      main = title.trim()
      subtitle = rest.join(' ').trim()
    }

    return {
      title: parts[0].trim(),
      number: parts[1] || null,
      main,
      subtitle: subtitle.length > 0 ? subtitle : null,
    }
  }

  /**
   * The type of the book barcode.
   */
  get codeType() {
    return Book.getCodeType(this.code ?? '')
  }

  /**
   * The authors joined in a single string.
   *
   * @type {string}
   */
  get authorsStr() {
    return (this.authors ?? []).join('; ')
  }

  /**
   * Returns true if the book has a NSFW tag.
   *
   * @type {boolean}
   */
  get isNsfw() {
    return this.tags.some(tag => NSFW_TAGS.includes(tag.toLowerCase()))
  }

  /**
   * Returns true if the book was read.
   *
   * @type {boolean}
   */
  get isRead() {
    return this.status === STATUS_READ
  }

  /**
   * Returns true if the book is a future item.
   *
   * @type {boolean}
   */
  get isFuture() {
    return this.status === STATUS_FUTURE
  }

  get labelPriceValueStr() {
    return this.labelPrice?.value && monetaryValidator(this.labelPrice.value)
      ? n(this.labelPrice.value, 'decimal')
      : ''
  }

  get paidPriceValueStr() {
    return this.paidPrice?.value && monetaryValidator(this.paidPrice.value)
      ? n(this.paidPrice.value, 'decimal')
      : ''
  }

  get dimensionsStr() {
    if (!this.dimensions?.width || !this.dimensions?.height) {
      return ''
    }

    const width = Number.isNaN(this.dimensions.width) ? '' : n(this.dimensions.width)
    const height = Number.isNaN(this.dimensions.height)
      ? ''
      : n(this.dimensions.height)

    return `${width} x ${height}`
  }

  get boughtAtStr() {
    return this.boughtAt ? this.boughtAt.toISOString().substring(0, 10) : ''
  }

  /**
   * The ISBN information.
   */
  get isbnData() {
    if (!this.codeType.includes('ISBN')) {
      return null
    }

    return getIsbnCountry(this.code ?? '')
  }

  /**
   * Compares this book with b.
   *
   * @param {Book} b The other book to compare
   * @returns {number} the comparison
   */
  compare(b: Book): number {
    return (
      this.group!.localeCompare(b.group!, locale)
        || this.titleParts.title.localeCompare(b.titleParts.title, locale)
        || this.publisher!.localeCompare(b.publisher!, locale)
        || (this.titleParts.number ?? '01').localeCompare(
          b.titleParts.number ?? '01',
          locale,
        )
    )
  }

  /**
   * Formats the book as a proper array to be inserted in the sheet.
   *
   * @returns {string[]} the array representation
   */
  toArray(): string[] {
    const now = new Date()
    const timezoned = new Date(now)
    timezoned.setMinutes(now.getMinutes() - now.getTimezoneOffset())

    const offset = timezoned.getTimezoneOffset()

    this.updatedAt = now
    this.createdAt = this.createdAt ?? now

    return [
      '=ROW()',
      this.id ?? nanoid(),
      this.code!,
      this.group!,
      this.title!,
      this.authorsStr,
      this.publisher!,
      `${n(this.dimensions!.width, 'dimensions', 'en-US')
        } × ${
        n(this.dimensions!.height, 'dimensions', 'en-US')}`,
      this.status ?? STATUS_UNREAD,
      this.readAt ? formatDateToSheet(fixDate(this.readAt, offset)) : '',
      this.labelPrice!.currency,
      n(this.labelPrice!.value, 'decimal', 'en-US'),
      this.paidPrice!.currency,
      n(this.paidPrice!.value, 'decimal', 'en-US'),
      this.store!,
      this.coverUrl ?? '',
      this.boughtAt ? formatDateToSheet(fixDate(this.boughtAt, offset)) : '',
      this.favorite ? FAVORITE_ACTIVE : FAVORITE_INACTIVE,
      this.synopsis ?? '',
      this.notes ?? '',
      this.tags ? this.tags.join(', ').toUpperCase() : '',
      formatDateTimeToSheet(fixDate(this.createdAt!, offset) ?? timezoned),
      formatDateTimeToSheet(timezoned),
    ]
  }

  /**
   * Creates a book from a DataTable row.
   *
   * @param {any[]} rowData The data table row data
   * @returns {Book} The formatted book
   */
  static fromDataTable(rowData: any[]): Book {
    const row = rowData[Columns.ROW]
    const dimensions = rowData[Columns.DIMENSIONS].split(' × ')

    return new Book({
      sheetLocation: `Collection!B${row}`,
      row,
      id: rowData[Columns.ID],
      code: rowData[Columns.CODE],
      group: rowData[Columns.GROUP],
      title: rowData[Columns.TITLE],
      authors: rowData[Columns.AUTHORS].split(/;\s+/g),
      publisher: rowData[Columns.PUBLISHER],
      dimensions: {
        width: Number.parseFloat(dimensions[0]),
        height: Number.parseFloat(dimensions[1]),
      },
      status: rowData[Columns.STATUS],
      readAt: rowData[Columns.READ_AT],
      labelPrice: {
        currency: rowData[Columns.LABEL_PRICE_CURRENCY],
        value: rowData[Columns.LABEL_PRICE_VALUE],
      },
      paidPrice: {
        currency: rowData[Columns.PAID_PRICE_CURRENCY],
        value: rowData[Columns.PAID_PRICE_VALUE],
      },
      store: rowData[Columns.STORE],
      coverUrl: rowData[Columns.COVER_URL] || '',
      boughtAt: rowData[Columns.BOUGHT_AT],
      favorite: rowData[Columns.FAVORITE] === FAVORITE_ACTIVE,
      synopsis: rowData[Columns.SYNOPSIS] || '',
      notes: rowData[Columns.NOTES] || '',
      tags: rowData[Columns.TAGS]
        ? rowData[Columns.TAGS]
          .split(/,\s*/)
          .map((t: string) => t.toUpperCase())
        : [],
      createdAt: rowData[Columns.CREATED_AT],
      updatedAt: rowData[Columns.UPDATED_AT],
    })
  }

  /**
   * Creates a book from a CBL record.
   *
   * @param {CblBook} cblBook The CBL record
   * @returns {Book} A formatted book
   */
  static fromCbl(cblBook: CblBook): Book {
    const dimensions = cblBook.Dimensao
      ? cblBook.Dimensao.match(/(\d{2})(\d)?x(\d{2})(\d)?$/)
      : null

    return new Book({
      code: cblBook.RowKey,
      title: (cblBook.Title ?? '')
        .trim()
        .replace(/(?::| -)? ?(?:v|vol|volume)?(?:\.|:)? ?(\d+)$/i, ' #$1')
        .replace(/#(\d{1})$/, '#0$1'),
      authors:
        cblBook.Profissoes
        && cblBook.Profissoes.length >= (cblBook.Authors ?? []).length
          ? (cblBook.Authors ?? []).filter((_, i) =>
              CBL_ALLOWED_ROLES.includes(cblBook.Profissoes![i]),
            )
          : cblBook.Authors,
      publisher:
        PUBLISHER_REPLACEMENTS[cblBook.Imprint as string] ?? cblBook.Imprint,
      dimensions: dimensions
        ? {
            width: Number.parseFloat(
              dimensions[1] + (dimensions[2] ? `.${dimensions[2]}` : ''),
            ),
            height: Number.parseFloat(
              dimensions[3] + (dimensions[4] ? `.${dimensions[4]}` : ''),
            ),
          }
        : null,
      synopsis: cblBook.Sinopse || '',
      provider: 'CBL',
    })
  }

  /**
   * Creates a book from a Google Book record.
   *
   * @param {GoogleBook} googleBook The Google Book record
   * @returns {Book} A formatted book
   */
  static fromGoogleBooks(googleBook: GoogleBook): Book {
    const volumeInfo = googleBook.volumeInfo
    const isbn13 = (volumeInfo.industryIdentifiers || []).find(
      identifier => identifier.type === 'ISBN_13',
    )
    const isbn10 = (volumeInfo.industryIdentifiers || []).find(
      identifier => identifier.type === 'ISBN_10',
    )

    const width = volumeInfo.dimensions
      ? Number.parseFloat(volumeInfo.dimensions.width.replace(/\s(.*)$/, ''))
      : null
    const height = volumeInfo.dimensions
      ? Number.parseFloat(volumeInfo.dimensions.height.replace(/\s(.*)$/, ''))
      : null

    return new Book({
      code: isbn13 ? isbn13.identifier : isbn10!.identifier,
      title: volumeInfo.title
        .trim()
        .replace(/(?::| -)? ?(?:v|vol|volume)?(?:\.|:)? ?(\d+)$/i, ' #$1')
        .replace(/#(\d{1})$/, '#0$1'),
      authors: volumeInfo.authors ?? [],
      publisher: volumeInfo.publisher ?? '',
      synopsis: volumeInfo.description ?? '',
      dimensions: width && height ? { width, height } : null,
      provider: 'Google Books',
    })
  }

  /**
   * Creates a book from a Open Library record.
   *
   * @param {OpenLibraryBook} openLibraryBook The Open Library record
   * @param {OpenLibraryBookDetails | null} details The record details
   * @returns {Book} A formatted book
   */
  static fromOpenLibrary(
    openLibraryBook: OpenLibraryBook,
    details: OpenLibraryBookDetails | null,
  ): Book {
    const code = openLibraryBook.identifiers.isbn_13
      ? openLibraryBook.identifiers.isbn_13[0]
      : openLibraryBook.identifiers.isbn_10![0]

    const book = new Book({
      code,
      title: openLibraryBook.title
        .trim()
        .replace(/(?::| -)? ?(?:v|vol|volume)?(?:\.|:)? ?(\d+)$/i, ' #$1')
        .replace(/#(\d{1})$/, '#0$1'),
      authors: (openLibraryBook.authors ?? []).map(author => author.name),
      publisher:
        openLibraryBook.publishers.length > 0
          ? openLibraryBook.publishers[0].name
          : '',
      coverUrl: openLibraryBook.cover?.large ?? '',
      provider: 'Open Library',
    })

    if (details) {
      const physicalDimensions = details.physical_dimensions ?? ''
      const dimensions = physicalDimensions
        .replace(' centimeters', '')
        .split(' x ')
        .map(Number.parseFloat)
        .filter(dm => !Number.isNaN(dm))

      Object.assign(book, {
        synopsis: details.description ?? '',
        dimensions:
          physicalDimensions.includes('centimeters') && dimensions.length === 3
            ? {
                width: dimensions[1],
                height: dimensions[0],
              }
            : null,
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
  static getCodeType(
    code: string,
  ): 'ISBN-13' | 'ISBN-10' | 'ISSN' | 'EAN-13' | 'ID' | 'N/A' {
    code = code.replace(/-/g, '')

    if (isValidIsbn(code)) {
      return code.length === 13 ? 'ISBN-13' : 'ISBN-10'
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
