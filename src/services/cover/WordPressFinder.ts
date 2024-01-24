import axios from 'axios'

import CoverFinder from './CoverFinder'
import type Book from '@/model/Book'

interface WordpressEntity {
  _embedded: {
    'wp:featuredmedia': {
      source_url: string
    }[]
  }
}

export default class WordPressFinder<S extends keyof Book> extends CoverFinder {
  url = ''

  collection = 'posts'

  queryParameter = 'search'

  searchWith!: S

  /**
   * Query transformer.
   *
   * @callback QueryTransformer
   * @param {any} searchQuery The search query to transform
   * @returns {any} The search query transformed.
   */

  /** @type {QueryTransformer | null} */
  queryTransformer: ((value: Book[S]) => string) | null = null

  /**
   * Creates a new WordPress cover finder.
   */
  constructor(properties: Partial<WordPressFinder<S>>) {
    super()
    Object.assign(this, properties)
  }

  async find(book: Book) {
    const collection = this.collection
    const searchParam = this.queryParameter
    let searchQuery = String(book[this.searchWith])

    if (this.queryTransformer) {
      searchQuery = this.queryTransformer(book[this.searchWith])
    }

    try {
      const response = await axios.get<WordpressEntity[]>(
        `${this.url}/wp-json/wp/v2/${collection}`,
        {
          params: {
            _embed: 'wp:featuredmedia',
            [searchParam]: searchQuery,
          },
        },
      )

      if (response.data.length === 0) {
        return []
      }

      return response.data
        .filter(item => item._embedded['wp:featuredmedia'])
        .map(item => item._embedded['wp:featuredmedia'][0].source_url)
    } catch (e) {
      return []
    }
  }
}
