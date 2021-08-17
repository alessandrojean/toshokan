import Cbl from './Cbl'
import GoogleBooks from './GoogleBooks'
import OpenLibrary from './OpenLibrary'

import i18n from '@/i18n'

/**
 * Search by the ISBN in the providers.
 *
 * @param {String} isbn the ISBN to search
 * @returns {Promise<Object[]>} an array of books
 */
export default async function search (isbn) {
  const { locale } = i18n.global

  const googleBooks = new GoogleBooks()
  const openLibrary = new OpenLibrary()

  const allPromises = [
    googleBooks.search(isbn),
    openLibrary.search(isbn)
  ]

  if (process.env.VUE_APP_CBL_QUERY_KEY) {
    const cbl = new Cbl()

    allPromises.push(cbl.search(isbn))
  }

  const results = await Promise.allSettled(allPromises)

  return results
    .flatMap(result => result.value || [])
    .sort((a, b) => a.provider.localeCompare(b.provider, locale.value))
}
