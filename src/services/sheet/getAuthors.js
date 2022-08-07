import buildSheetUrl from './buildSheetUrl'

import { CollectionColumns } from '@/model/Book'
import QueryBuilder from '@/data/QueryBuilder'

/**
 * Find all the authors.
 *
 * @param {string} sheetId The sheet to perform the operation
 * @returns {Promise<string[]>} The authors found
 */
export default async function getAuthors(sheetId) {
  const sheetUrl = buildSheetUrl(sheetId)

  const query = new QueryBuilder(sheetUrl)
    .select(CollectionColumns.AUTHORS)
    .build()

  const dataTable = await query.send()

  const allAuthors = dataTable.asArray.flatMap((rowData) =>
    rowData[0].split(/;\s+/g)
  )

  return Array.from(new Set(allAuthors)).sort()
}
