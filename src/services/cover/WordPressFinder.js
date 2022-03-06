import axios from 'axios'

import CoverFinder from './CoverFinder'

export default class WordPressFinder extends CoverFinder {
  collection = 'posts'

  queryParameter = 'search'

  /** @type {keyof import('@/model/Book').default} */
  searchWith = 'code'

  /**
   * Query transformer.
   *
   * @callback QueryTransformer
   * @param {any} searchQuery The search query to transform
   * @returns {any} The search query transformed.
   */

  /** @type {QueryTransformer | null} */
  queryTransformer = null

  /**
   * Creates a new WordPress cover finder.
   *
   * @param {Partial<WordPressFinder>} properties The properties
   */
  constructor(properties) {
    super()
    Object.assign(this, properties)
  }

  async find(book) {
    const collection = this.collection
    const searchParam = this.queryParameter
    let searchQuery = book[this.searchWith]

    if (this.queryTransformer) {
      searchQuery = this.queryTransformer(searchQuery)
    }

    try {
      const response = await axios.get(
        this.url + '/wp-json/wp/v2/' + collection,
        {
          params: {
            _embed: 'wp:featuredmedia',
            [searchParam]: searchQuery
          }
        }
      )

      if (response.data.length === 0) {
        return []
      }

      return response.data
        .filter((item) => item._embedded['wp:featuredmedia'])
        .map((item) => item._embedded['wp:featuredmedia'][0].source_url)
    } catch (e) {
      return []
    }
  }
}
