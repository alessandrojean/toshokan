import getBooks from './getBooks'

export default function getBooksFromGroup (sheetId, idMap, group, page = 1, options = {}) {
  return getBooks(sheetId, idMap, page, { ...options, group })
}
