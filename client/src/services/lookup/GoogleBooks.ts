import axios from 'axios'

import Lookup from './Lookup'
import Book from '@/model/Book'
import { isbn as isValidIsbn } from '@/util/validators'
import i18n from '@/i18n'

interface GoogleBooksSearchResponse {
  totalItems: number
  items: GoogleBook[]
}

export interface GoogleBook {
  volumeInfo: {
    title: string
    authors?: string[]
    publisher?: string
    description?: string
    dimensions?: {
      width: string
      height: string
    }
    industryIdentifiers: {
      type: 'ISBN_13' | 'ISBN_10'
      identifier: string
    }[]
  }
}

export default class GoogleBooks extends Lookup {
  _createAxios() {
    return axios.create({
      baseURL: 'https://www.googleapis.com/books/v1',
    })
  }

  async search(isbn: string) {
    const { t } = i18n.global

    if (!isValidIsbn(isbn)) {
      throw new Error(t('isbn.invalid'))
    }

    isbn = isbn.replace(/-/g, '')
    const bibKey = `isbn:${isbn}`

    try {
      const { data } = await this.axios.get<GoogleBooksSearchResponse>(
        'volumes',
        {
          params: {
            q: bibKey,
          },
        },
      )

      return data.items?.map(Book.fromGoogleBooks) || []
    } catch (e) {
      throw new Error(t('isbn.searchError'))
    }
  }
}
