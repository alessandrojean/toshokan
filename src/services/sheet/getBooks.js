import dedent from 'dedent'

import i18n from '@/i18n'

import buildSheetUrl from './buildSheetUrl'
import countTotalResults from './countTotalResults'
import { PER_PAGE } from './constants'

import Book, {
  CollectionColumns,
  FAVORITE_ACTIVE,
  STATUS_FUTURE
} from '@/model/Book'

export default async function getBooks (sheetId, page = 1, options = {}) {
  const sheetUrl = buildSheetUrl(sheetId)

  const offset = (page - 1) * PER_PAGE
  const orderBy = options.orderBy || CollectionColumns.CREATED_AT
  const orderDirection = options.orderDirection || 'desc'
  const limit = options.limit || PER_PAGE

  let orderByStr = `${orderBy} ${orderDirection}`

  if (
    orderBy === CollectionColumns.LABEL_PRICE_VALUE ||
    orderBy === CollectionColumns.PAID_PRICE_VALUE
  ) {
    const currencyColumn = orderBy === CollectionColumns.LABEL_PRICE_VALUE
      ? CollectionColumns.LABEL_PRICE_CURRENCY
      : CollectionColumns.PAID_PRICE_CURRENCY
    orderByStr = `${currencyColumn} asc, ${orderByStr}`
  }

  const conditions = []

  if (options.groups) {
    const groupConditions = options.groups
      .map(group => `${CollectionColumns.GROUP} = "${group}"`)
      .join(' or ')

    conditions.push('(' + groupConditions + ')')
  }

  if (options.futureItems === 'only' || options.futureItems === 'hide') {
    const comparation = options.futureItems === 'only' ? '=' : '!='
    conditions.push(`${CollectionColumns.STATUS} ${comparation} '${STATUS_FUTURE}'`)
  }

  if (options.favorites === 'only') {
    conditions.push(`${CollectionColumns.FAVORITE} = '${FAVORITE_ACTIVE}'`)
  }

  const where = conditions.length > 0
    ? `where ${conditions.join(' and ')}`
    : ''

  const queryStr = dedent`
    select * ${where}
    order by ${orderByStr}
    limit ${limit} offset ${offset}
  `

  const totalResults = options.dontCount
    ? null
    : await countTotalResults(sheetId, queryStr)

  const query = new window.google.visualization.Query(sheetUrl)
  query.setQuery(queryStr)

  return new Promise((resolve, reject) => {
    query.send(response => {
      if (response.isError()) {
        const message = i18n.global.t('errors.badQuery', { error: response.getMessage() })
        reject(new Error(message))

        return
      }

      const dataTable = response.getDataTable()

      const rows = dataTable.getNumberOfRows()
      const books = []

      for (let i = 0; i < rows; i++) {
        books.push(Book.fromDataTable(dataTable, i))
      }

      resolve({ books, totalResults })
    })
  })
}
