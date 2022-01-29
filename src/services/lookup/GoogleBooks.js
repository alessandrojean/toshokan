import axios from 'axios'

import Book from '@/model/Book'
import { isbn as validateIsbn } from '@/util/validators'
import i18n from '@/i18n'

import Lookup from './Lookup'

export default class GoogleBooks extends Lookup {
  createAxios () {
    return axios.create({
      baseURL: 'https://www.googleapis.com/books/v1'
    })
  }

  async search (isbn) {
    const { t } = i18n.global

    if (!validateIsbn(isbn)) {
      throw new Error(t('isbn.invalid'))
    }

    isbn = isbn.replace(/-/g, '')
    const bibKey = `isbn:${isbn}`

    try {
      const { data } = await this.axios.get('volumes', {
        params: {
          q: bibKey
        }
      })

      return data.items.map(Book.fromGoogleBooks)
    } catch (e) {
      throw new Error(t('isbn.searchError'))
    }
  }
}
