import searchQuery, { parse } from 'search-query-parser'

import i18n from '@/i18n'

import buildSheetUrl from './buildSheetUrl'
import countTotalResults from './countTotalResults'
import { PER_PAGE } from './constants'

import Book, { CollectionColumns } from '@/model/Book'
import { isoDate as validateDate } from '@/util/validators'
import QueryBuilder, {
  BinaryOperator,
  OrderBy,
  WhereCondition,
  WhereRestriction
} from '@/data/QueryBuilder'
import { isoDate, lastDayOfMonth } from '@/util/date'
import type { Sort } from '@/types'

type SearchKeyword = {
  column: string
  equals?: boolean
  joinWith?: 'and' | 'or'
  excludeJoinWith?: 'and' | 'or'
  date?: boolean
  dateRange?: boolean
  withTime?: boolean
  operation?: BinaryOperator
  inverseOperation?: BinaryOperator
}

export function createSearchKeywords(): Record<string, SearchKeyword> {
  return {
    [i18n.global.t('dashboard.search.keywords.id')]: {
      column: CollectionColumns.ID,
      equals: true
    },
    [i18n.global.t('dashboard.search.keywords.code')]: {
      column: CollectionColumns.CODE,
      equals: true
    },
    [i18n.global.t('dashboard.search.keywords.title')]: {
      column: CollectionColumns.TITLE
    },
    [i18n.global.t('dashboard.search.keywords.group')]: {
      column: CollectionColumns.GROUP,
      equals: true
    },
    [i18n.global.t('dashboard.search.keywords.author')]: {
      column: CollectionColumns.AUTHORS
    },
    [i18n.global.t('dashboard.search.keywords.publisher')]: {
      column: CollectionColumns.PUBLISHER
    },
    [i18n.global.t('dashboard.search.keywords.store')]: {
      column: CollectionColumns.STORE
    },
    [i18n.global.t('dashboard.search.keywords.notes')]: {
      column: CollectionColumns.NOTES
    },
    [i18n.global.t('dashboard.search.keywords.tags')]: {
      column: CollectionColumns.TAGS,
      joinWith: 'and',
      excludeJoinWith: 'or'
    },
    [i18n.global.t('dashboard.search.keywords.boughtAt')]: {
      column: CollectionColumns.BOUGHT_AT,
      date: true,
      operation: '=',
      inverseOperation: '!=',
      dateRange: true
    },
    [i18n.global.t('dashboard.search.keywords.boughtBefore')]: {
      column: CollectionColumns.BOUGHT_AT,
      date: true,
      operation: '<',
      inverseOperation: '>='
    },
    [i18n.global.t('dashboard.search.keywords.boughtAfter')]: {
      column: CollectionColumns.BOUGHT_AT,
      date: true,
      operation: '>',
      inverseOperation: '<='
    },
    [i18n.global.t('dashboard.search.keywords.readAt')]: {
      column: CollectionColumns.READ_AT,
      date: true,
      operation: '=',
      inverseOperation: '!=',
      dateRange: true
    },
    [i18n.global.t('dashboard.search.keywords.readBefore')]: {
      column: CollectionColumns.READ_AT,
      date: true,
      operation: '<',
      inverseOperation: '>='
    },
    [i18n.global.t('dashboard.search.keywords.readAfter')]: {
      column: CollectionColumns.READ_AT,
      date: true,
      operation: '>',
      inverseOperation: '<='
    },
    [i18n.global.t('dashboard.search.keywords.createdAt')]: {
      column: CollectionColumns.CREATED_AT,
      date: true,
      withTime: true,
      operation: '=',
      inverseOperation: '!=',
      dateRange: true
    },
    [i18n.global.t('dashboard.search.keywords.createdBefore')]: {
      column: CollectionColumns.CREATED_AT,
      date: true,
      withTime: true,
      operation: '<',
      inverseOperation: '>='
    },
    [i18n.global.t('dashboard.search.keywords.createdAfter')]: {
      column: CollectionColumns.CREATED_AT,
      date: true,
      withTime: true,
      operation: '>',
      inverseOperation: '<='
    },
    [i18n.global.t('dashboard.search.keywords.updatedAt')]: {
      column: CollectionColumns.UPDATED_AT,
      date: true,
      withTime: true,
      operation: '=',
      inverseOperation: '!=',
      dateRange: true
    },
    [i18n.global.t('dashboard.search.keywords.updatedBefore')]: {
      column: CollectionColumns.UPDATED_AT,
      date: true,
      withTime: true,
      operation: '<',
      inverseOperation: '>='
    },
    [i18n.global.t('dashboard.search.keywords.updatedAfter')]: {
      column: CollectionColumns.UPDATED_AT,
      date: true,
      withTime: true,
      operation: '>',
      inverseOperation: '<='
    }
  }
}

export type SearchBooksArgs = {
  sheetId: string
  searchTerm: string
  sort?: {
    sortBy?: (string | [string, Sort])[]
    sortDirection?: Sort
  }
  page: number
}

/**
 * Perform an advanced search in the books.
 *
 * @param {SearchBooksArgs} options The search options
 * @returns {Promise<{ results: Book[], total: number }>} The books found
 */
export default async function searchBooks({
  sheetId,
  searchTerm,
  sort,
  page = 1
}: SearchBooksArgs): Promise<{ results: Book[]; total: number }> {
  const sheetUrl = buildSheetUrl(sheetId)

  const queryBuilder = new QueryBuilder(sheetUrl)
    .orderBy([CollectionColumns.UPDATED_AT, 'desc'])
    .limit(PER_PAGE)
    .offset((page - 1) * PER_PAGE)

  let searchQueryObj: ReturnType<typeof parse> = searchTerm

  if (sort) {
    const builderObj = queryBuilder.toObject()
    const orderBy = (sort.sortBy ?? [builderObj.orderBy[0][0]]).map(
      (property) => {
        return !Array.isArray(property)
          ? ([
              property,
              sort.sortDirection ?? builderObj.orderBy[0][1]
            ] as OrderBy)
          : (property as unknown as OrderBy)
      }
    )

    queryBuilder.orderBy(...orderBy)
  }

  const keywords = createSearchKeywords()

  if (typeof searchTerm === 'string') {
    searchTerm = searchTerm.toLowerCase()
    searchQueryObj = searchTerm

    const searchOptions = {
      keywords: Object.keys(keywords),
      alwaysArray: true
    }

    searchQueryObj = searchQuery.parse(searchTerm, searchOptions)
  }

  if (typeof searchQueryObj === 'string') {
    const searchRegex = searchTerm
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .toLowerCase()

    const { AUTHORS, CODE, ID, TITLE } = CollectionColumns

    queryBuilder
      .where(`lower(${TITLE})`, 'matches', `.*${searchRegex}.*`)
      .orWhere(`lower(${AUTHORS})`, 'matches', `.*${searchRegex}.*`)
      .orWhere(ID, searchTerm)
      .orWhere(CODE, searchTerm)
  } else {
    const restrictions: WhereCondition['restrictions'] = Object.entries(
      searchQueryObj
    ).flatMap(([localeKeyword, values]) => {
      const keywordInfo: SearchKeyword = keywords[localeKeyword]

      if (!keywordInfo) {
        return []
      }

      let tests = []

      if (keywordInfo.equals) {
        const column = `lower(${keywordInfo.column})`
        tests = values.map((v: any) => [column, '=', v] as WhereRestriction)
      } else if (keywordInfo.date) {
        const isEquality = keywordInfo.operation === '='
        const isUnique = values.length === 1 || isEquality
        const isValidDate = isEquality
          ? values.every((date: any) => validateDate(date as string, true))
          : validateDate(values[0] as string)

        if (isUnique && isValidDate) {
          const column = keywordInfo.withTime
            ? `toDate(${keywordInfo.column})`
            : keywordInfo.column
          const operation = keywordInfo.operation

          const checks: WhereCondition['restrictions'] = values.map(
            (date: any) => {
              if (isEquality) {
                const [year, month, day] = (date as string)
                  .split('-')
                  .map((n) => parseInt(n, 10))
                const dates = []

                if (year && month && day) {
                  dates.push(date)
                } else if (year && month) {
                  const start = date + '-01'
                  const end = date + '-' + lastDayOfMonth(year, month)
                  dates.push(start, end)
                } else {
                  dates.push(date + '-01-01', date + '-12-31')
                }

                const [start, end] = dates.map(isoDate)

                return start && end
                  ? QueryBuilder.and(
                      [column, '>= date', start],
                      [column, '<= date', end]
                    )
                  : ([column, `${operation} date`, start] as WhereRestriction)
              }

              return [
                column,
                `${operation} date`,
                isoDate(date)
              ] as WhereRestriction
            }
          )

          const dateTests =
            checks.length > 1 ? [QueryBuilder.or(...checks)] : checks

          tests = [QueryBuilder.and([column, 'is not', 'null'], ...dateTests)]
        }
      } else {
        const column = `lower(${keywordInfo.column})`
        tests = values.map((v: any) => [column, 'matches', `.*${v}.*`])
      }

      const joinWith = keywordInfo.joinWith ?? 'or'

      return values.length === 1 || keywordInfo.date
        ? tests
        : [QueryBuilder[joinWith](...tests)]
    })

    const excludingRestrictions = Object.entries(
      searchQueryObj.exclude ?? {}
    ).flatMap(([localeKeyword, values]) => {
      const keywordInfo: SearchKeyword = keywords[localeKeyword]

      if (!keywordInfo) {
        return []
      }

      let tests: WhereCondition['restrictions'] = []

      if (keywordInfo.equals) {
        const column = `lower(${keywordInfo.column})`
        tests = values.map((v: any) => [column, '!=', v] as WhereRestriction)
      } else if (keywordInfo.date) {
        const isDifferent = keywordInfo.inverseOperation === '!='
        const isUnique = values.length === 1 || isDifferent
        const isValidDate = isDifferent
          ? values.every((date: any) => validateDate(date as string, true))
          : validateDate(values[0])

        if (isUnique && isValidDate) {
          const column = keywordInfo.withTime
            ? `toDate(${keywordInfo.column})`
            : keywordInfo.column
          const inverseOperation = keywordInfo.inverseOperation

          const checks: WhereCondition['restrictions'] = values.map(
            (date: any) => {
              if (isDifferent) {
                const [year, month, day] = (date as string)
                  .split('-')
                  .map((n) => parseInt(n, 10))
                const dates = []

                if (year && month && day) {
                  dates.push(date)
                } else if (year && month) {
                  const start = date + '-01'
                  const end = date + '-' + lastDayOfMonth(year, month)
                  dates.push(start, end)
                } else {
                  dates.push(date + '-01-01', date + '-12-31')
                }

                const [start, end] = dates.map(isoDate)

                return start && end
                  ? QueryBuilder.andNot(
                      [column, '>= date', start],
                      [column, '<= date', end]
                    )
                  : ([
                      column,
                      `${inverseOperation} date`,
                      start
                    ] as WhereRestriction)
              }

              return [
                column,
                `${inverseOperation} date`,
                isoDate(date)
              ] as WhereRestriction
            }
          )

          const dateTests =
            checks.length > 1 ? [QueryBuilder.and(...checks)] : checks

          tests = [QueryBuilder.and([column, 'is not', 'null'], ...dateTests)]
        }
      } else {
        const column = `not lower(${keywordInfo.column})`
        tests = values.map(
          (v: any) => [column, 'matches', `.*${v}.*`] as WhereRestriction
        )
      }

      const excludeJoinWith = keywordInfo.excludeJoinWith || 'and'

      return values.length === 1 || keywordInfo.date
        ? tests
        : [QueryBuilder[excludeJoinWith](...tests)]
    })

    restrictions.push(...excludingRestrictions)

    if (searchQueryObj.text) {
      restrictions.push([
        `lower(${CollectionColumns.TITLE})`,
        'matches',
        `.*${searchQueryObj.text}.*`
      ])
    }

    queryBuilder.andWhere(restrictions)
  }

  const query = queryBuilder.build()
  const totalResults = await countTotalResults(sheetId, query)

  const dataTable = await query.send()

  return {
    results: dataTable.asArray.map(Book.fromDataTable),
    total: totalResults
  }
}
