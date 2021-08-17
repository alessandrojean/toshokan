import axios from 'axios'

import Lookup from './Lookup'

import { parseBookFromOpenLibrary } from '@/model/Book'
import { isbn as validateIsbn } from '@/util/validators'
import i18n from '@/i18n'

export default class OpenLibrary extends Lookup {
  createAxios () {
    return axios.create({
      baseURL: 'https://openlibrary.org/api/',
      headers: {
        Accept: 'application/json'
      }
    })
  }

  async search (isbn) {
    const { t } = i18n.global

    isbn = isbn.replace(/-/g, '')

    if (!validateIsbn(isbn)) {
      throw new Error(t('isbn.invalid'))
    }

    const bibKey = `ISBN:${isbn}`

    try {
      const { data } = await this.axios.get('books', {
        params: {
          bibkeys: bibKey,
          jscmd: 'data',
          format: 'json'
        }
      })

      if (!data[bibKey]) {
        return []
      }

      return parseBookFromOpenLibrary(data[bibKey])
    } catch (e) {
      throw new Error(t('isbn.searchError'))
    }
  }
}
