import dedent from 'dedent'

import i18n from '@/i18n'

import buildSheetUrl from './buildSheetUrl'

import Book, { CollectionColumns } from '@/model/Book'

export default function getBookByCode (sheetId, idMap, code) {
  const sheetUrl = buildSheetUrl(sheetId)

  const query = new window.google.visualization.Query(sheetUrl)
  query.setQuery(dedent`
    select *
    where ${CollectionColumns.CODE} = "${code}"
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

      if (rows === 0) {
        resolve(null)
        return
      }

      const books = []

      for (let i = 0; i < rows; i++) {
        books.push(Book.fromDataTable(dataTable, idMap, i))
      }

      resolve(books)
    })
  })
}
