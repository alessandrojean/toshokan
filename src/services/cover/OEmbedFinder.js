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
    const urlPath = this.createPath(book)

    try {
      const url = encodeURIComponent(this.baseUrl + urlPath)

      const response = await axios.get(
        this.baseUrl + '/wp-json/oembed/1.0/embed?url=' + url
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
