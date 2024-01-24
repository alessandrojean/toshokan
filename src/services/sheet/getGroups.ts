import buildSheetUrl from './buildSheetUrl'

import { CollectionColumns, STATUS_FUTURE } from '@/model/Book'
import QueryBuilder from '@/data/QueryBuilder'

/**
 * Find all the groups and its count.
 *
 * @param {string} sheetId The sheet to perform the operation
 * @returns {Promise<{ name: string, count: number, futureCount: number, totalCount: number }[]}>} The groups found
 */
export default async function getGroups(
  sheetId: string,
): Promise<
  { name: string, count: number, futureCount: number, totalCount: number }[]
> {
  const sheetUrl = buildSheetUrl(sheetId)

  const { GROUP, STATUS } = CollectionColumns
  const query = new QueryBuilder(sheetUrl)
    .select(GROUP, STATUS, `count(${GROUP})`)
    .where(GROUP)
    .groupBy(GROUP, STATUS)
    .build()

  const dataTable = await query.send()
  const groupMap = new Map()

  dataTable.asArray.forEach((rowData) => {
    const [group, status, count] = rowData

    if (!groupMap.has(group)) {
      groupMap.set(group, {
        name: group,
        count: 0,
        futureCount: 0,
        totalCount: 0,
      })
    }

    const groupObj = groupMap.get(group)

    if (status === STATUS_FUTURE) {
      groupObj.futureCount = count
    } else {
      groupObj.count += count
    }

    groupObj.totalCount += count
  })

  return Array.from(groupMap.values()).sort((a, b) => b.count - a.count)
}
