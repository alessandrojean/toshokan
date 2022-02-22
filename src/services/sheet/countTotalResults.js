import { CollectionColumns } from '@/model/Book'

/**
 * Counts the total number of results in a specific
 * query by removing the limits.
 *
 * @param {string} sheetId The sheet to perform the count
 * @param {import('@/data/Query').default} query The query to be transformed
 * @returns {Promise<number>} The number of results
 */
export default async function countTotalResults (sheetId, query) {
  const { ID } = CollectionColumns
  const newQuery = query.newBuilder()
    .select(`count(${ID})`)
    .orderBy()
    .groupBy()
    .limit(null)
    .offset(null)
    .build()

  const dataTable = await newQuery.send()

  if (dataTable.getNumberOfRows() === 0) {
    return 0
  }

  return dataTable.getValue(0, 0)
}
