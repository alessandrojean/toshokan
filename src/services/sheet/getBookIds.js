import dedent from 'dedent'

import i18n from '@/i18n'

import buildSheetUrl from './buildSheetUrl'

import { CollectionColumns } from '@/model/Book'

export default function getBookIds (sheetId) {
  const sheetUrl = buildSheetUrl(sheetId)

  const query = new window.google.visualization.Query(sheetUrl)
  query.setQuery(dedent`
    select ${CollectionColumns.ID}
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
        resolve({})
        return
      }

      const ids = {}

      for (let i = 0; i < rows; i++) {
        const id = dataTable.getValue(i, 0)
        ids[id] = i + 5
      }

      resolve(ids)
    })
  })
}
