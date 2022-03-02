import getColumnUniqueValues from './getColumnUniqueValues'

import { CollectionColumns } from '@/model/Book'

/**
 * Find all the publishers and its count.
 *
 * @param {string} sheetId The sheet to perform the operation
 * @returns The publishers found
 */
export default async function getPublishers(sheetId) {
  return await getColumnUniqueValues(sheetId, CollectionColumns.PUBLISHER, true)
}
