import dedent from 'dedent'

import i18n from '@/i18n'

import buildSheetUrl from './buildSheetUrl'

import { CollectionColumns, STATUS_FUTURE } from '@/model/Book'

export default async function getGroups (sheetId) {
  const sheetUrl = buildSheetUrl(sheetId)

  const query = new window.google.visualization.Query(sheetUrl)
  query.setQuery(dedent`
    select ${CollectionColumns.GROUP}, ${CollectionColumns.STATUS}, count(${CollectionColumns.GROUP})
    where ${CollectionColumns.GROUP} is not null
    group by ${CollectionColumns.GROUP}, ${CollectionColumns.STATUS}
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
      const groupMap = new Map()

      for (let i = 0; i < rows; i++) {
        const group = dataTable.getValue(i, 0)

        if (!groupMap.has(group)) {
          groupMap.set(group, {
            name: group,
            count: 0,
            futureCount: 0,
            totalCount: 0
          })
        }

        const groupObj = groupMap.get(group)
        const status = dataTable.getValue(i, 1)
        const count = dataTable.getValue(i, 2)

        if (status === STATUS_FUTURE) {
          groupObj.futureCount = count
        } else {
          groupObj.count += count
        }

        groupObj.totalCount += count
      }

      const groups = Array.from(groupMap.values())
        .sort((a, b) => b.count - a.count)

      resolve(groups)
    })
  })
}
