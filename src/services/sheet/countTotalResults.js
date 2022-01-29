import i18n from '@/i18n'

import buildSheetUrl from './buildSheetUrl'

import { CollectionColumns } from '@/model/Book'

export default function countTotalResults (sheetId, queryStr) {
  const sheetUrl = buildSheetUrl(sheetId)

  const newQueryStr = queryStr
    .replaceAll('\n', ' ')
    .replace('select *', `select count(${CollectionColumns.ID})`)
    .replace(/order.*$/, '')
    .trim()

  const query = new window.google.visualization.Query(sheetUrl)
  query.setQuery(newQueryStr)

  return new Promise((resolve, reject) => {
    query.send(response => {
      if (response.isError()) {
        const message = i18n.global.t('errors.badQuery', { error: response.getMessage() })
        reject(new Error(message))

        return
      }

      const dataTable = response.getDataTable()

      if (dataTable.getNumberOfRows() === 0) {
        resolve(0)
        return
      }

      const totalResults = dataTable.getValue(0, 0)

      resolve(totalResults)
    })
  })
}
