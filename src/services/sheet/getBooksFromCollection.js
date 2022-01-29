import dedent from 'dedent'

import i18n from '@/i18n'

import buildSheetUrl from './buildSheetUrl'

import Book, { CollectionColumns } from '@/model/Book'

export default function getBooksFromCollection (sheetId, idMap, book) {
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
      const books = []

      if (rows < 2) {
        resolve(books)
        return
      }

      for (let i = 0; i < rows; i++) {
        books.push(Book.fromDataTable(dataTable, idMap, i))
      }

      resolve(books)
    })
  })
}
