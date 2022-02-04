import getBooks from './getBooks'

export default function getBooksFromGroup (sheetId, group, page = 1, options = {}) {
  return getBooks(sheetId, page, { ...options, group })
}
