import getBooks, { GetBooksArgs } from './getBooks'

/**
 * Find books of a group.
 *
 * @param {string} sheetId The sheet to perform the operation
 * @param {string} group The group
 * @param {number} page The page
 * @param {GetBooksArgs} options The options
 * @returns The books found
 */
export default function getBooksFromGroup(
  sheetId: string,
  group: string,
  page: number = 1,
  options: GetBooksArgs = {}
) {
  return getBooks(sheetId, page, { ...options, groups: [group] })
}
