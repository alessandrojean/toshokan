import buildSheetUrl from './buildSheetUrl'
import QueryBuilder from '@/data/QueryBuilder'

/**
 * Find the unique values and its count from a column.
 *
 * @param {string} sheetId The sheet to perform the operation
 * @param {string} column The column to lookup.
 * @param {boolean} alphabetically The default sort
 * @returns {Promise<{ name: string, count: number }[]}>} The values found
 */
export default async function getColumnUniqueValues(
  sheetId: string,
  column: string,
  alphabetically?: boolean,
): Promise<{ name: string, count: number }[]> {
  const sheetUrl = buildSheetUrl(sheetId)

  const queryBuilder = new QueryBuilder(sheetUrl)
    .select(column, `count(${column})`)
    .groupBy(column)
    .orderBy([`count(${column})`, 'desc'], [column, 'asc'])

  if (alphabetically) {
    queryBuilder.orderBy([column, 'asc'])
  }

  const query = queryBuilder.build()
  const dataTable = await query.send()

  return dataTable.asArray.map(([name, count]) => ({ name, count }))
}
