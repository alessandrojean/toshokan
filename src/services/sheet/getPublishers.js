import getColumnUniqueValues from './getColumnUniqueValues'

import { CollectionColumns } from '@/model/Book'

export default async function getPublishers (sheetId) {
  return await getColumnUniqueValues(sheetId, CollectionColumns.PUBLISHER, true)
}
