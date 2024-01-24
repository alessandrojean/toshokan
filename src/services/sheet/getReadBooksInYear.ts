import buildSheetUrl from './buildSheetUrl'

import Book, { CollectionColumns } from '@/model/Book'
import QueryBuilder from '@/data/QueryBuilder'

/**
 * Gets all books reads in a year.
 */
export default async function getReadBooksInYear(
  sheetId: string,
  year: number,
): Promise<Record<number, Book[]>> {
  const sheetUrl = buildSheetUrl(sheetId)

  const { READ_AT } = CollectionColumns
  const query = new QueryBuilder(sheetUrl)
    .where(READ_AT)
    .andWhere(`year(${READ_AT})`, '=', year)
    .orderBy([READ_AT, 'asc'])
    .build()

  const dataTable = await query.send()

  return dataTable.asArray.map(Book.fromDataTable).reduce((record, item) => {
    const key = item.readAt!.getUTCMonth() + 1

    if (record[key]) {
      record[key].push(item)
    } else {
      record[key] = [item]
    }

    return record
  }, {} as Record<number, Book[]>)
}
