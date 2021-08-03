import { nanoid } from 'nanoid'

import { IMPRINT_REPLACEMENTS } from '../services/cbl'
import {
  ean as validateEan,
  isbn as validateIsbn,
  issn as validateIssn
} from '../util/validators'

import i18n from '../i18n'

const { d, n, locale } = i18n.global

export const Columns = {
  ID: 0,
  CODE: 1,
  COLLECTION: 2,
  TITLE: 3,
  AUTHORS: 4,
  IMPRINT: 5,
  FORMAT: 6,
  STATUS: 7,
  READ_AT: 8,
  LABEL_PRICE: 9,
  PAID_PRICE: 10,
  STORE: 11,
  COVER_URL: 12,
  BOUGHT_AT: 13,
  FAVORITE: 14,
  CREATED_AT: 15,
  UPDATED_AT: 16
}

export const CollectionColumns = {
  ID: 'B',
  CODE: 'C',
  COLLECTION: 'D',
  TITLE: 'E',
  AUTHORS: 'F',
  IMPRINT: 'G',
  FORMAT: 'H',
  STATUS: 'I',
  READ_AT: 'J',
  LABEL_PRICE: 'K',
  PAID_PRICE: 'L',
  STORE: 'M',
  COVER_URL: 'N',
  BOUGHT_AT: 'O',
  FAVORITE: 'P',
  CREATED_AT: 'Q',
  UPDATED_AT: 'R'
}

export const PropertyToColumn = {
  title: CollectionColumns.TITLE,
  imprint: CollectionColumns.IMPRINT,
  status: CollectionColumns.STATUS,
  'paidPrice.value': CollectionColumns.PAID_PRICE,
  'labelPrice.value': CollectionColumns.LABEL_PRICE,
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

export function parseBook (value, index) {
  const labelPrice = value[Columns.LABEL_PRICE].split(' ')
  const paidPrice = value[Columns.PAID_PRICE].split(' ')

  return {
    sheetLocation: `Collection!B${index + 5}`,
    id: value[Columns.ID],
    code: value[Columns.CODE],
    codeType: getCodeType(value[Columns.CODE]),
    collection: value[Columns.COLLECTION],
    title: value[Columns.TITLE],
    titleParts: splitTitle(value[Columns.TITLE]),
    authors: value[Columns.AUTHORS].split(/;\s+/g),
    authorsStr: value[Columns.AUTHORS],
    imprint: value[Columns.IMPRINT],
    format: value[Columns.FORMAT].split(' × ')
      .map(measure => n(parseFloat(measure), 'format'))
      .join(' × '),
    status: value[Columns.STATUS],
    readAt: value[Columns.READ_AT],
    labelPrice: {
      currency: labelPrice[0],
      value: n(labelPrice[1] ? parseFloat(labelPrice[1]) : 0.0, 'decimal')
    },
    paidPrice: {
      currency: paidPrice[0],
      value: n(paidPrice[1] ? parseFloat(paidPrice[1]) : 0.0, 'decimal')
    },
    labelPriceCurrency: labelPrice[0],
    labelPriceValue: n(labelPrice[1] ? parseFloat(labelPrice[1]) : 0.0, 'decimal'),
    paidPriceCurrency: paidPrice[0],
    paidPriceValue: n(paidPrice[1] ? parseFloat(paidPrice[1]) : 0.0, 'decimal'),
    store: value[Columns.STORE],
    coverUrl: value[Columns.COVER_URL],
    boughtAt: value[Columns.BOUGHT_AT],
    favorite: value[Columns.FAVORITE],
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
    collection: getProperty(Columns.COLLECTION),
    title: getProperty(Columns.TITLE),
    titleParts: splitTitle(getProperty(Columns.TITLE)),
    authors: getProperty(Columns.AUTHORS).split(/;\s+/g),
    authorsStr: getProperty(Columns.AUTHORS),
    imprint: getProperty(Columns.IMPRINT),
    format: getProperty(Columns.FORMAT).split(' × ')
      .map(measure => n(parseFloat(measure), 'format'))
      .join(' × '),
    status: getProperty(Columns.STATUS),
    readAt: getProperty(Columns.READ_AT) || '',
    labelPrice: {
      currency: labelPrice[0],
      value: n(labelPrice[1] ? parseFloat(labelPrice[1]) : 0.0, 'decimal')
    },
    paidPrice: {
      currency: paidPrice[0],
      value: n(paidPrice[1] ? parseFloat(paidPrice[1]) : 0.0, 'decimal')
    },
    labelPriceCurrency: labelPrice[0],
    labelPriceValue: n(labelPrice[1] ? parseFloat(labelPrice[1]) : 0.0, 'decimal'),
    paidPriceCurrency: paidPrice[0],
    paidPriceValue: n(paidPrice[1] ? parseFloat(paidPrice[1]) : 0.0, 'decimal'),
    store: getProperty(Columns.STORE),
    coverUrl: getProperty(Columns.COVER_URL) || '',
    boughtAt: getProperty(Columns.BOUGHT_AT) || '',
    favorite: getProperty(Columns.FAVORITE) || '',
    createdAt: new Date(getProperty(Columns.CREATED_AT)),
    updatedAt: new Date(getProperty(Columns.UPDATED_AT))
  }
}

export function formatBook (book) {
  return [
    book.id || nanoid(),
    book.code.replace(/^(\d{3})(\d{2})(\d{4})(\d{3})(\d{1})$/, '$1-$2-$3-$4-$5'),
    book.collection,
    book.title,
    book.authors.join('; '),
    book.imprint,
    book.format.replace(
      /^(\d+(?:(?:\.|,)\d{1,2})?) (?:x|×) (\d+(?:(?:\.|,)\d{1,2})?)$/,
      (m, p1, p2) => {
        return n(parseFloat(p1.replace(',', '.')), 'format', 'en-US') +
          ' × ' + n(parseFloat(p2.replace(',', '.')), 'format', 'en-US')
      }
    ),
    book.status || BookStatus.UNREAD,
    book.readAt ? book.readAt : '',
    book.labelPrice.currency + ' ' +
      n(parseFloat(book.labelPrice.value.replace(',', '.')), 'decimal', 'en-US'),
    book.paidPrice.currency + ' ' +
      n(parseFloat(book.paidPrice.value.replace(',', '.')), 'decimal', 'en-US'),
    book.store,
    book.coverUrl || '',
    book.boughtAt ? book.boughtAt : '',
    book.favorite || BookFavorite.INACTIVE,
    d(book.createdAt || new Date(), 'sheet', 'en-US')
      .replace(',', '')
      .replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2'),
    d(new Date(), 'sheet', 'en-US')
      .replace(',', '')
      .replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2')
  ]
}

export function splitTitle (title) {
  const titleRegex = /\s+#(\d+)(?::\s+)?/
  return title.split(titleRegex)
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

  return {
    code: cblBook.RowKey,
    codeType: cblBook.RowKey.length === 13 ? 'ISBN-13' : 'ISBN-10',
    title: cblBook.Title.trim()
      .replace(/(?::| -)? ?(?:v|vol|volume)?(?:\.|:)? ?(\d+)$/i, ' #$1')
      .replace(/#(\d{1})$/, '#0$1'),
    authors: cblBook.Profissoes && cblBook.Profissoes.length >= cblBook.Authors.length
      ? cblBook.Authors.filter((_, i) => allowedRoles.includes(cblBook.Profissoes[i]))
      : cblBook.Authors,
    imprint: IMPRINT_REPLACEMENTS[cblBook.Imprint] || cblBook.Imprint,
    format: cblBook.Dimensao
      ? cblBook.Dimensao.replace(/(\d{2})(\d)?x(\d{2})(\d)?$/, (m, p1, p2, p3, p4) => {
        return n(parseFloat(p1 + (p2 ? '.' + p2 : '')), 'format') + ' x ' +
          n(parseFloat(p3 + (p4 ? '.' + p4 : '')), 'format')
      })
      : ''
  }
}

export function bookCompare (a, b) {
  return a.collection.localeCompare(b.collection, locale.value) ||
    a.titleParts[0].localeCompare(b.titleParts[0], locale.value) ||
    a.imprint.localeCompare(b.imprint, locale.value) ||
    (a.titleParts[1] || '01').localeCompare(b.titleParts[1] || '01', locale.value)
}
