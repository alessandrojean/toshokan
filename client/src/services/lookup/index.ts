import Cbl from './Cbl'
import GoogleBooks from './GoogleBooks'
import OpenLibrary from './OpenLibrary'

import i18n from '@/i18n'
import type Book from '@/model/Book'

/**
 * Search by the ISBN in the providers.
 *
 * @param {string} isbn the ISBN to search
 * @returns {Promise<object[]>} an array of books
 */
export default async function search(isbn: string): Promise<Book[]> {
  const { locale } = i18n.global

  const googleBooks = new GoogleBooks()
  const openLibrary = new OpenLibrary()

  const allPromises = [googleBooks.search(isbn), openLibrary.search(isbn)]

  if (import.meta.env.VITE_APP_CBL_QUERY_KEY) {
    const cbl = new Cbl()

    allPromises.push(cbl.search(isbn))
  }

  const results = await Promise.allSettled(allPromises)

  return results
    .filter(result => result.status === 'fulfilled')
    .flatMap(result => (result as PromiseFulfilledResult<Book[]>).value)
    .sort((a, b) => a.provider!.localeCompare(b.provider!, locale))
}

export * from './Cbl'
export * from './GoogleBooks'
export * from './OpenLibrary'
