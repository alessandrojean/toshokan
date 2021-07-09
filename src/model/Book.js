import { nanoid } from 'nanoid'

import { IMPRINT_REPLACEMENTS } from '../services/cbl'
import { isbn as validateIsbn, issn as validateIssn } from '../util/validators'

import i18n from '../i18n'

const { d, n, locale } = i18n.global

const Columns = {
  ID: 0,
  CODE: 1,
  COLLECTION: 2,
  TITLE: 3,
  AUTHORS: 4,
  IMPRINT: 5,
  FORMAT: 6,
  STATUS: 7,
  LABEL_PRICE: 8,
  PAID_PRICE: 9,
  STORE: 10,
  COVER_URL: 11,
  BOUGHT_AT: 12,
  FAVORITE: 13,
  CREATED_AT: 14,
  UPDATED_AT: 15
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
    boughtAt: value[Columns.BOUGHT_AT].replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$1-$2'),
    favorite: value[Columns.FAVORITE],
    createdAt: new Date(value[Columns.CREATED_AT].replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$1-$2')),
    updatedAt: new Date(value[Columns.UPDATED_AT].replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$1-$2'))
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
    book.labelPrice.currency + ' ' +
      n(parseFloat(book.labelPrice.value.replace(',', '.')), 'decimal', 'en-US'),
    book.paidPrice.currency + ' ' +
      n(parseFloat(book.paidPrice.value.replace(',', '.')), 'decimal', 'en-US'),
    book.store,
    book.coverUrl || '',
    book.boughtAt ? book.boughtAt.replace(/(\d{4})-(\d{2})-(\d{2})/, '$2/$3/$1') : '',
    book.favorite || BookFavorite.INACTIVE,
    d(book.createdAt || new Date(), 'sheet', 'en-US').replace(',', ''),
    d(new Date(), 'sheet', 'en-US').replace(',', '')
  ]
}

export function splitTitle (title) {
  const titleRegex = /\s+#(\d+)(?::\s+)?/
  return title.split(titleRegex)
}

export function getCodeType (code) {
  code = code.replace(/-/g, '')

  if (code.match(/^789/)) {
    return 'EAN-13'
  }

  if (validateIsbn(code)) {
    return 'ISBN-' + code.length
  }

  if (validateIssn(code)) {
    return 'ISSN'
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
    authors: cblBook.Profissoes && cblBook.Profissoes.length === cblBook.Authors.length
      ? cblBook.Authors.filter((a, i) => allowedRoles.includes(cblBook.Profissoes[i]))
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
