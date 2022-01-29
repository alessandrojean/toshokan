import dedent from 'dedent'

import i18n from '@/i18n'

import buildSheetUrl from './buildSheetUrl'
import { PER_PAGE } from './constants'

import Book, { CollectionColumns, STATUS_READ } from '@/model/Book'

export default async function getLatestReadings (sheetId, idMap, options = {}) {
  const sheetUrl = buildSheetUrl(sheetId)

  const limit = options.limit || PER_PAGE

  const query = new window.google.visualization.Query(sheetUrl)
  query.setQuery(dedent`
    select *
    where ${CollectionColumns.READ_AT} is not null
      and ${CollectionColumns.STATUS} = "${STATUS_READ}"
    order by ${CollectionColumns.READ_AT} desc,
      ${CollectionColumns.UPDATED_AT} desc
    limit ${limit}
  `)

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
        books.push(Book.fromDataTable(dataTable, idMap, i))
      }

      resolve(books)
    })
  })
}
