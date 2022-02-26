import buildSheetUrl from './buildSheetUrl'
import countTotalResults from './countTotalResults'
import { PER_PAGE } from './constants'

import QueryBuilder from '@/data/QueryBuilder'
import Book, {
  CollectionColumns,
  FAVORITE_ACTIVE,
  STATUS_FUTURE
} from '@/model/Book'

/**
 * Search for books.
 *
 * @param {string} sheetId The sheet to perform the operation
 * @param {number} page The page of results
 * @param {Object} options The search searchOptions
 * @param {string?} options.orderBy The column to sort
 * @param {('asc' | 'desc')?} options.orderDirection The sort direction
 * @param {number?} options.limit The results limit
 * @param {string[]?} options.groups The groups to match
 * @param {('hide' | 'only' | 'indiferent')?} options.futureItems The future condition
 * @param {('only' | 'indiferent')?} options.favorites The favorites condition
 * @param {boolean?} options.dontCount Define if the count should be skipped
 * @returns {Promise<{ books: Book[], totalResults: number? }>} The books found
 */
export default async function getBooks (sheetId, page = 1, options = {}) {
  const sheetUrl = buildSheetUrl(sheetId)

  const { CREATED_AT, FAVORITE, GROUP, STATUS } = CollectionColumns
  const queryBuilder = new QueryBuilder(sheetUrl)
    .orderBy([options.orderBy || CREATED_AT, options.orderDirection || 'desc'])
    .limit(options.limit || PER_PAGE)
    .offset((page - 1) * PER_PAGE)

  const orderBy = queryBuilder.toObject().orderBy

  if (
    orderBy[0][0] === CollectionColumns.LABEL_PRICE_VALUE ||
    orderBy[0][0] === CollectionColumns.PAID_PRICE_VALUE
  ) {
    const currencyColumn = orderBy[0][0] === CollectionColumns.LABEL_PRICE_VALUE
      ? CollectionColumns.LABEL_PRICE_CURRENCY
      : CollectionColumns.PAID_PRICE_CURRENCY

    queryBuilder.orderBy(
      [currencyColumn, 'asc'],
      ...orderBy
    )
  }

  if (options.groups && options.groups.length > 0) {
    const groupConditions = options.groups
      .map(group => [GROUP, '=', group])

    queryBuilder.where(QueryBuilder.or(...groupConditions))
  }

  if (options.futureItems === 'only' || options.futureItems === 'hide') {
    const comparation = options.futureItems === 'only' ? '=' : '!='

    queryBuilder.andWhere(STATUS, comparation, STATUS_FUTURE)
  }

  if (options.favorites === 'only') {
    queryBuilder.andWhere(FAVORITE, '=', FAVORITE_ACTIVE)
  }

  const query = queryBuilder.build()

  const totalResults = options.dontCount
    ? null
    : await countTotalResults(sheetId, query)

  const dataTable = await query.send()

  return {
    books: dataTable.asArray.map(Book.fromDataTable),
    totalResults
  }
}
