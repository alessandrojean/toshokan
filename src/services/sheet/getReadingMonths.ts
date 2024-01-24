import buildSheetUrl from './buildSheetUrl'

import { CollectionColumns } from '@/model/Book'
import QueryBuilder from '@/data/QueryBuilder'

export interface ReadingMonthYear {
  month: number
  year: number
  count: number
}

/**
 * Gets all the months and years of read books.
 */
export default async function getReadingMonths(
  sheetId: string,
): Promise<ReadingMonthYear[]> {
  const sheetUrl = buildSheetUrl(sheetId)

  const { ID, READ_AT } = CollectionColumns
  const query = new QueryBuilder(sheetUrl)
    .select(`year(${READ_AT})`, `month(${READ_AT})`, `count(${ID})`)
    .where(READ_AT)
    .groupBy(`year(${READ_AT})`, `month(${READ_AT})`)
    .orderBy([`year(${READ_AT})`, 'asc'], [`month(${READ_AT})`, 'asc'])
    .build()

  const dataTable = await query.send()

  return dataTable.asArray
    .map(row => ({
      month: row[1] + 1,
      year: row[0],
      count: row[2],
    }))
    .filter(monthYear => monthYear.count > 0)
}
