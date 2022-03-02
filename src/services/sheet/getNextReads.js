import QueryBuilder from '@/data/QueryBuilder'
import Book, {
  CollectionColumns,
  STATUS_READ,
  STATUS_UNREAD
} from '@/model/Book'
import buildSheetUrl from './buildSheetUrl'

/**
 * Gets the next books to read, similar to 'continue watching'
 * section of the streaming services.
 *
 * @param {string} sheetId The sheet to perform the operation
 * @returns {Promise<Book[]>} The next books to read
 */
export default async function getNextReads(sheetId) {
  const sheetUrl = buildSheetUrl(sheetId)

  const { TITLE, READ_AT, UPDATED_AT, GROUP, PUBLISHER, STATUS } =
    CollectionColumns
  const lastReadsQuery = new QueryBuilder(sheetUrl)
    .where(READ_AT)
    .andWhere(STATUS, STATUS_READ)
    .andWhere(`dateDiff(now(), ${READ_AT})`, '<=', 6 * 30) // ~6 months
    .orderBy([READ_AT, 'desc'], [UPDATED_AT, 'desc'], [TITLE, 'desc'])
    .build()

  const lastReadsResult = await lastReadsQuery.send()
  const lastReads = lastReadsResult.asArray
    .map(Book.fromDataTable)
    .filter((book) => book.titleParts.number !== null)
    .reduce((array, current) => {
      const series = current.titleParts.title
      const exists = array.find((book) => book.titleParts.title === series)

      if (!exists) {
        array.push(current)
      }

      return array
    }, [])

  if (lastReads.length === 0) {
    return []
  }

  const collectionsQuery = new QueryBuilder(sheetUrl)
    .where(STATUS, STATUS_UNREAD)
    .andWhere(
      QueryBuilder.or(
        ...lastReads.map((book) => {
          return [TITLE, 'starts with', book.titleParts.title + ' #']
        })
      )
    )
    .orderBy([GROUP, 'asc'], [PUBLISHER, 'asc'], [TITLE, 'asc'])
    .build()

  const collectionsResult = await collectionsQuery.send()
  const collectionsBooks = collectionsResult.asArray.map(Book.fromDataTable)

  return lastReads
    .map((book) => {
      const readNumber = parseInt(book.titleParts.number)

      const next = collectionsBooks.find((colBook) => {
        const colNumber = parseInt(colBook.titleParts.number)

        return (
          colBook.titleParts.title === book.titleParts.title &&
          (colNumber === readNumber + 1 || colNumber === readNumber) &&
          colBook.publisher === book.publisher &&
          colBook.group === book.group
        )
      })

      return { readAt: book.readAt, next }
    })
    .filter((tuple) => tuple.next !== undefined)
    .sort((a, b) => b.readAt - a.readAt)
    .map((tuple) => tuple.next)
    .slice(0, 6)
}
