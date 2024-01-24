import { CollectionColumns } from '@/model/Book'
import type Query from '@/data/Query'

/**
 * Counts the total number of results in a specific
 * query by removing the limits.
 *
 * @param {string} sheetId The sheet to perform the count
 * @param {Query} query The query to be transformed
 * @returns {Promise<number>} The number of results
 */
export default async function countTotalResults(
  sheetId: string,
  query: Query,
): Promise<number> {
  const { ID } = CollectionColumns
  const newQuery = query
    .newBuilder()!
    .select(`count(${ID})`)
    .orderBy()
    .groupBy()
    .limit(null)
    .offset(null)
    .build()

  const dataTable = await newQuery.send()

  if (dataTable.rows === 0) {
    return 0
  }

  return dataTable.getValue(0, 0)
}
