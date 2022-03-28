import axios from 'axios'

import CoverFinder from './CoverFinder'

export default class OEmbedFinder extends CoverFinder {
  /**
   * Create path function.
   *
   * @callback CreatePath
   * @param {import('@/model/Book').default} book The book
   * @returns {string} The URL
   */

  /** @type {CreatePath | null} */
  createPath = null

  baseUrl = ''

  /**
   * Creates a oEmbed finder.
   *
   * @param {Partial<OEmbedFinder>} properties The properties
   */
  constructor(properties) {
    super()
    Object.assign(this, properties)
  }

  async find(book) {
    try {
      const response = await axios.get(
        this.baseUrl + '/wp-json/oembed/1.0/embed',
        {
          params: {
            url: this.baseUrl + this.createPath(book)
          }
        }
      )

      if (!response.data.thumbnail_url) {
        return []
      }

      return [response.data.thumbnail_url]
    } catch (e) {
      return []
    }
  }
}
