import axios from 'axios'

import Lookup from './Lookup'

import Book from '@/model/Book'
import { isbn as isValidIsbn } from '@/util/validators'
import i18n from '@/i18n'

interface OpenLibraryBookResponse {
  [bibkey: string]: OpenLibraryBook
}

export interface OpenLibraryBook {
  title: string
  authors: { name: string }[]
  publishers: { name: string }[]
  identifiers: {
    isbn_13?: string[]
    isbn_10?: string[]
  }
  cover?: {
    small?: string
    medium?: string
    large?: string
  }
}
export interface OpenLibraryBookDetails {
  physical_dimensions?: string
  description?: { value: string }
}

export default class OpenLibrary extends Lookup {
  _createAxios() {
    return axios.create({
      baseURL: 'https://openlibrary.org/',
      headers: {
        Accept: 'application/json',
      },
    })
  }

  async #findDetails(isbn: string) {
    try {
      const { data } = await this.axios.get<OpenLibraryBookDetails>(
        `isbn/${isbn}.json`,
      )

      return data
    } catch (e) {
      return null
    }
  }

  async search(isbn: string) {
    const { t } = i18n.global

    isbn = isbn.replace(/-/g, '')

    if (!isValidIsbn(isbn)) {
      throw new Error(t('isbn.invalid'))
    }

    const bibKey = `ISBN:${isbn}`

    try {
      const { data } = await this.axios.get<OpenLibraryBookResponse>(
        'api/books',
        {
          params: {
            bibkeys: bibKey,
            jscmd: 'data',
            format: 'json',
          },
        },
      )

      if (!data[bibKey]) {
        return []
      }

      const details = await this.#findDetails(isbn)

      return [Book.fromOpenLibrary(data[bibKey], details)]
    } catch (e) {
      throw new Error(t('isbn.searchError'))
    }
  }
}
