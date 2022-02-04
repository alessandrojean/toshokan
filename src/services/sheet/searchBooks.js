import dedent from 'dedent'
import searchQuery from 'search-query-parser'

import i18n from '@/i18n'

import buildSheetUrl from './buildSheetUrl'
import countTotalResults from './countTotalResults'
import { PER_PAGE } from './constants'

import Book, { CollectionColumns, PropertyToColumn } from '@/model/Book'
import { isoDate as validateDate } from '@/util/validators'

export function createSearchKeywords () {
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
      inverseOperation: '!='
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
      inverseOperation: '!='
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
      inverseOperation: '!='
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
      inverseOperation: '!='
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

export default async function searchBooks ({ sheetId, searchTerm, sort, page = 1 }) {
  const sheetUrl = buildSheetUrl(sheetId)

  let searchQueryObj = searchTerm
  let sortBy = CollectionColumns.UPDATED_AT
  let sortDirection = 'desc'

  if (sort) {
    sortBy = sort.sortBy ? PropertyToColumn[sort.sortBy] : sortBy
    sortDirection = sort.sortDirection || sortDirection
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

  const query = new window.google.visualization.Query(sheetUrl)

  if (typeof searchQueryObj === 'string') {
    const searchRegex = searchTerm
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .toLowerCase()

    query.setQuery(dedent`
      select *
      where lower(${CollectionColumns.TITLE}) matches ".*${searchRegex}.*"
        or lower(${CollectionColumns.AUTHORS}) matches ".*${searchRegex}.*"
        or ${CollectionColumns.ID} = "${searchTerm}"
        or ${CollectionColumns.CODE} = "${searchTerm}"
      order by ${sortBy} ${sortDirection}
      limit ${PER_PAGE} offset ${(page - 1) * PER_PAGE}
    `)
  } else {
    const conditions = Object.entries(searchQueryObj)
      .flatMap(([localeKeyword, values]) => {
        const keywordInfo = keywords[localeKeyword]

        if (!keywordInfo) {
          return []
        }

        let tests = []

        if (keywordInfo.equals) {
          tests = values.map(v => `lower(${keywordInfo.column}) = "${v}"`)
        } else if (keywordInfo.date) {
          const isEquality = keywordInfo.operation === '='
          const isUnique = values.length === 1 || isEquality
          const isValidDate = isEquality
            ? values.every(date => validateDate(date))
            : validateDate(values[0])

          if (isUnique && isValidDate) {
            const column = keywordInfo.withTime
              ? `toDate(${keywordInfo.column})`
              : keywordInfo.column

            const checks = values.map(date => {
              const isoDate = date
                .replace(/-(\d)-/, '0$1')
                .replace(/-(\d)$/, '0$1')

              return `${column} ${keywordInfo.operation} date "${isoDate}"`
            })

            tests = [`(${checks.join(' or ')})`]
          }
        } else {
          tests = values.map(v => `lower(${keywordInfo.column}) matches ".*${v}.*"`)
        }

        const joinWith = keywordInfo.joinWith || 'or'

        return (values.length === 1 || keywordInfo.date)
          ? tests
          : ['(' + tests.join(` ${joinWith} `) + ')']
      })

    const excludingConditions = Object.entries(searchQueryObj.exclude)
      .flatMap(([localeKeyword, values]) => {
        const keywordInfo = keywords[localeKeyword]

        if (!keywordInfo) {
          return []
        }

        let tests = []

        if (keywordInfo.equals) {
          tests = values.map(v => `lower(${keywordInfo.column}) != "${v}"`)
        } else if (keywordInfo.date) {
          const isDifferent = keywordInfo.inverseOperation === '!='
          const isUnique = values.length === 1 || isDifferent
          const isValidDate = isDifferent
            ? values.every(date => validateDate(date))
            : validateDate(values[0])

          if (isUnique && isValidDate) {
            const column = keywordInfo.withTime
              ? `toDate(${keywordInfo.column})`
              : keywordInfo.column

            const checks = values.map(date => {
              const isoDate = date
                .replace(/-(\d)-/, '0$1')
                .replace(/-(\d)$/, '0$1')

              return `${column} ${keywordInfo.inverseOperation} date "${isoDate}"`
            })

            tests = [`(${checks.join(' and ')})`]
          }
        } else {
          tests = values.map(v => `not lower(${keywordInfo.column}) matches ".*${v}.*"`)
        }

        const excludeJoinWith = keywordInfo.excludeJoinWith || 'and'

        return (values.length === 1 || keywordInfo.date)
          ? tests
          : ['(' + tests.join(` ${excludeJoinWith} `) + ')']
      })

    conditions.push(...excludingConditions)

    if (searchQueryObj.text) {
      conditions.push(
        `lower(${CollectionColumns.TITLE}) matches ".*${searchQueryObj.text}.*"`
      )
    }

    query.setQuery(dedent`
      select *
      where ${conditions.join('\n  and ')}
      order by ${sortBy} ${sortDirection}
      limit ${PER_PAGE} offset ${(page - 1) * PER_PAGE}
    `)
  }

  const totalResults = await countTotalResults(sheetId, query.query)

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

      resolve({ results: books, total: totalResults })
    })
  })
}
