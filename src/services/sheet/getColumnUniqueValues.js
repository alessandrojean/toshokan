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
export default async function getColumnUniqueValues (sheetId, column, alphabetically) {
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

  const rows = dataTable.getNumberOfRows()
  const values = []

  for (let i = 0; i < rows; i++) {
    values.push({
      name: dataTable.getValue(i, 0),
      count: dataTable.getValue(i, 1)
    })
  }

  return values
}
