import axios from 'axios'

import Lookup from './Lookup'

import Book from '@/model/Book'
import { isbn as validateIsbn } from '@/util/validators'
import i18n from '@/i18n'

export default class OpenLibrary extends Lookup {
  _createAxios () {
    return axios.create({
      baseURL: 'https://openlibrary.org/',
      headers: {
        Accept: 'application/json'
      }
    })
  }

  async #findDetails (isbn) {
    try {
      const { data } = await this.axios.get(`isbn/${isbn}.json`)

      return data
    } catch (e) {
      return null
    }
  }

  async search (isbn) {
    const { t } = i18n.global

    isbn = isbn.replace(/-/g, '')

    if (!validateIsbn(isbn)) {
      throw new Error(t('isbn.invalid'))
    }

    const bibKey = `ISBN:${isbn}`

    try {
      const { data } = await this.axios.get('api/books', {
        params: {
          bibkeys: bibKey,
          jscmd: 'data',
          format: 'json'
        }
      })

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
