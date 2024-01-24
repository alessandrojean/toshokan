import axios from 'axios'

import CoverFinder from './CoverFinder'
import type Book from '@/model/Book'

interface OEmbedResponse {
  thumbnail_url?: string
}

export default class OEmbedFinder extends CoverFinder {
  createPath: (book: Book) => string = b => b.code!

  baseUrl = ''

  /**
   * Creates a oEmbed finder.
   */
  constructor(properties: Partial<OEmbedFinder>) {
    super()
    Object.assign(this, properties)
  }

  async find(book: Book) {
    try {
      const response = await axios.get<OEmbedResponse>(
        `${this.baseUrl}/wp-json/oembed/1.0/embed`,
        {
          params: {
            url: this.baseUrl + this.createPath(book),
          },
        },
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
