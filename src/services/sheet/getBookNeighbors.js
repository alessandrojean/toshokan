import dedent from 'dedent'

import i18n from '@/i18n'

import buildSheetUrl from './buildSheetUrl'

import Book, { CollectionColumns, Columns } from '@/model/Book'

export default function getBookNeighbors (sheetId, idMap, book) {
  const sheetUrl = buildSheetUrl(sheetId)

  const query = new window.google.visualization.Query(sheetUrl)
  query.setQuery(dedent`
    select *
    where ${CollectionColumns.TITLE} starts with "${book.titleParts.title}"
      and ${CollectionColumns.PUBLISHER} = "${book.publisher}"
      and ${CollectionColumns.GROUP} = "${book.group}"
    order by ${CollectionColumns.TITLE} asc
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

      if (rows === 1) {
        resolve(null)
        return
      }

      let bookRow = 0

      for (let i = 0; i < rows; i++) {
        if (dataTable.getValue(i, Columns.TITLE) === book.title) {
          bookRow = i
          break
        }
      }

      const previous = bookRow > 0
        ? Book.fromDataTable(dataTable, idMap, bookRow - 1)
        : null

      const next = bookRow < rows - 1
        ? Book.fromDataTable(dataTable, idMap, bookRow + 1)
        : null

      resolve({ previous, next })
    })
  })
}
