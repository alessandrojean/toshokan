import getColumnUniqueValues from './getColumnUniqueValues'

import { CollectionColumns } from '@/model/Book'

export default async function getStores (sheetId) {
  return await getColumnUniqueValues(sheetId, CollectionColumns.STORE, true)
}
