import dedent from 'dedent'

import i18n from '@/i18n'

import buildSheetUrl from './buildSheetUrl'

export default function getColumnUniqueValues (sheetId, column, alphabetically) {
  const sheetUrl = buildSheetUrl(sheetId)

  const orderBy = alphabetically
    ? `${column} asc`
    : `count(${column}) desc, ${column} asc`

  const query = new window.google.visualization.Query(sheetUrl)
  query.setQuery(dedent`
    select ${column}, count(${column})
    group by ${column}
    order by ${orderBy}
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
      const values = []

      for (let i = 0; i < rows; i++) {
        values.push({
          name: dataTable.getValue(i, 0),
          count: dataTable.getValue(i, 1)
        })
      }

      resolve(values)
    })
  })
}
