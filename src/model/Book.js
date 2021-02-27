import { nanoid } from 'nanoid'

import { IMPRINT_REPLACEMENTS } from '../services/cbl'
import { isbn as validateIsbn, issn as validateIssn } from '../util/validators'

export function parseBook (value, index) {
  const labelPrice = value[8].split(' ')
  const paidPrice = value[9].split(' ')

  return {
    sheetLocation: `Coleção!B${index + 5}`,
    id: value[0],
    code: value[1],
    codeType: getCodeType(value[1]),
    collection: value[2],
    title: value[3],
    titleParts: splitTitle(value[3]),
    authors: value[4].split(/;\s+/g),
    imprint: value[5],
    format: value[6].replace(/\./g, ','),
    status: value[7],
    labelPrice: {
      currency: labelPrice[0],
      value: labelPrice[1].replace('.', ',') || '0,0'
    },
    paidPrice: {
      currency: paidPrice[0],
      value: paidPrice[1].replace('.', ',') || '0,0'
    },
    store: value[10],
    coverUrl: value[11],
    boughtAt: value[12].split('/').reverse().join('-'),
    favorite: value[13],
    createdAt: new Date(value[14].replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1')),
    updatedAt: new Date(value[15].replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1'))
  }
}

const formatFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
  useGrouping: false
})

const priceFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  useGrouping: false
})

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'medium'
})

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
        return formatFormatter.format(p1.replace(',', '.')) +
          ' × ' + formatFormatter.format(p2.replace(',', '.'))
      }
    ),
    book.status || 'Não lido',
    book.labelPrice.currency + ' ' +
      priceFormatter.format(book.labelPrice.value.replace(',', '.')),
    book.paidPrice.currency + ' ' +
      priceFormatter.format(book.paidPrice.value.replace(',', '.')),
    book.store,
    book.coverUrl || '',
    book.boughtAt ? book.boughtAt.replace(/(\d{4})-(\d{2})-(\d{2})/, '$3/$2/$1') : '',
    book.favorite || '',
    dateFormatter.format(book.createdAt || new Date()),
    dateFormatter.format(new Date())
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
    title: cblBook.Title.trim()
      .replace(/(?::| -)? ?(?:v|vol|volume)?(?:\.|:)? ?(\d+)$/i, ' #$1')
      .replace(/#(\d{1})$/, '#0$1'),
    authors: cblBook.Profissoes && cblBook.Profissoes.length === cblBook.Authors.length
      ? cblBook.Authors.filter((a, i) => allowedRoles.includes(cblBook.Profissoes[i]))
      : cblBook.Authors,
    imprint: IMPRINT_REPLACEMENTS[cblBook.Imprint] || cblBook.Imprint,
    format: cblBook.Dimensao
      ? cblBook.Dimensao.replace(/(\d+)(\d)x(\d+)(\d)$/, '$1,$2 x $3,$4')
      : ''
  }
}

export function bookCompare (a, b) {
  return a.collection.localeCompare(b.collection) ||
    a.titleParts[0].localeCompare(b.titleParts[0]) ||
    a.imprint.localeCompare(b.imprint) ||
    (a.titleParts[1] || '01').localeCompare(b.titleParts[1] || '01')
}
