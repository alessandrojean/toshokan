import buildSheetUrl from './buildSheetUrl'
import countTotalResults from './countTotalResults'
import { PER_PAGE } from './constants'

import QueryBuilder, { type OrderBy, type WhereRestriction,
} from '@/data/QueryBuilder'
import Book, { CollectionColumns, FAVORITE_ACTIVE, STATUS_FUTURE } from '@/model/Book'
import type { Sort, TriState } from '@/types'

export interface GetBooksArgs {
  orderBy?: (string | [string, Sort])[]
  orderDirection?: Sort
  limit?: number
  groups?: string[]
  futureItems?: TriState
  favorites?: TriState
  dontCount?: boolean
}

/**
 * Search for books.
 *
 * @param {string} sheetId The sheet to perform the operation
 * @param {number} page The page of results
 * @param {GetBooksArgs} options The search searchOptions
 * @returns {Promise<{ books: Book[], totalResults: number? }>} The books found
 */
export default async function getBooks(
  sheetId: string,
  page: number = 1,
  options: GetBooksArgs = {},
): Promise<{ books: Book[], totalResults: number | null }> {
  const sheetUrl = buildSheetUrl(sheetId)

  const { CREATED_AT, FAVORITE, GROUP, STATUS } = CollectionColumns
  const orderBy = (options.orderBy ?? [CREATED_AT]).map((property) => {
    return typeof property === 'string'
      ? ([property, options.orderDirection ?? 'desc'] as OrderBy)
      : (property as OrderBy)
  })

  const queryBuilder = new QueryBuilder(sheetUrl)
    .orderBy(...orderBy)
    .limit(options.limit ?? PER_PAGE)
    .offset((page - 1) * (options.limit ?? PER_PAGE))

  if (options.groups && options.groups.length > 0) {
    const groupConditions = options.groups.map(
      group => [GROUP, '=', group] as WhereRestriction,
    )

    queryBuilder.where(QueryBuilder.or(...groupConditions))
  }

  if (options.futureItems === 'only' || options.futureItems === 'hide') {
    const comparation = options.futureItems === 'only' ? '=' : '!='

    queryBuilder.andWhere(STATUS, comparation, STATUS_FUTURE)
  }

  if (options.favorites === 'only' || options.favorites === 'hide') {
    const comparation = options.favorites === 'only' ? '=' : '!='

    queryBuilder.andWhere(FAVORITE, comparation, FAVORITE_ACTIVE)
  }

  const query = queryBuilder.build()

  const totalResults = options.dontCount
    ? null
    : await countTotalResults(sheetId, query)

  const dataTable = await query.send()

  return {
    books: dataTable.asArray.map(Book.fromDataTable),
    totalResults,
  }
}
