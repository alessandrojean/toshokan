import getBooks from './getBooks'

/**
 * Find books of a group.
 *
 * @param {string} sheetId The sheet to perform the operation
 * @param {string} group The group
 * @param {number} page The page
 * @param {Record<string, any>} options The options
 * @returns The books found
 */
export default function getBooksFromGroup(
  sheetId,
  group,
  page = 1,
  options = {}
) {
  return getBooks(sheetId, page, { ...options, group })
}
