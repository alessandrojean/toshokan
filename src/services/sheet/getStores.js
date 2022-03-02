import getColumnUniqueValues from './getColumnUniqueValues'

import { CollectionColumns } from '@/model/Book'

/**
 * Find all the stores and its count.
 *
 * @param {string} sheetId The sheet to perform the operation
 * @returns The stores found
 */
export default async function getStores(sheetId) {
  return await getColumnUniqueValues(sheetId, CollectionColumns.STORE, true)
}
