import axios from 'axios'
import slugify from 'slugify'

import { convertIsbn13ToIsbn10 } from '../util/isbn'

async function directUrl (book) {
  if (this.condition && !this.condition(book)) {
    return []
  }

  let valueToReplace = book[this.property]

  if (this.propertyTransformer) {
    valueToReplace = this.propertyTransformer(valueToReplace)
  }

  return [this.url.replace(/\{value\}/g, valueToReplace)]
}

async function wordpress (book) {
  const collection = this.collection || 'posts'
  const searchParam = this.queryParameter || 'search'
  let searchQuery = book[this.searchWith]

  if (this.queryTransformer) {
    searchQuery = this.queryTransformer(searchQuery)
  }

  try {
    const response = await axios.get(this.url + '/wp-json/wp/v2/' + collection, {
      params: {
        _embed: 'wp:featuredmedia',
        [searchParam]: searchQuery
      }
    })

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

// eslint-disable-next-line no-unused-vars
async function oembed (book) {
  const urlPath = this.createPath(book)

  try {
    const url = encodeURIComponent(this.baseUrl + urlPath)

    const response = await axios.get(this.baseUrl + '/wp-json/oembed/1.0/embed?url=' + url)

    if (!response.data.thumbnail_url) {
      return []
    }

    return [response.data.thumbnail_url]
  } catch (e) {
    return []
  }
}

const AMAZON = {
  url: 'https://images-na.ssl-images-amazon.com/images/P/{value}.01._SCRM_SL700_.jpg',
  property: 'code',
  propertyTransformer: isbn => {
    isbn = isbn.replace(/-/g, '')

    if (isbn.length === 10) {
      return isbn
    }

    return convertIsbn13ToIsbn10(isbn)
  },
  find: directUrl
}

const AVAILABLE_SITES = [
  // Wordpress send multiple CORS headers.
  // {
  //   name: 'JBC',
  //   baseUrl: 'https://editorajbc.com.br',
  //   createPath: book => {
  //     const series = slugify(book.titleParts[0]).replace('especial', 'esp')
  //     const title = slugify(book.title).replace('especial', 'esp')
  //
  //     return `/mangas/colecao/${series}/vol/${title}`
  //   },
  //   find: oembed
  // },
  {
    name: 'Mino',
    url: 'https://editoramino.com',
    searchWith: 'title',
    collection: 'project',
    find: wordpress
  },
  {
    name: 'NewPOP',
    url: 'https://www.newpop.com.br',
    searchWith: 'code',
    find: wordpress
  },
  {
    name: 'Pipoca & Nanquim',
    url: 'https://pipocaenanquim.com.br',
    searchWith: 'title',
    collection: 'product',
    find: wordpress
  },
  {
    name: 'Shueisha',
    url: 'https://dosbg3xlm0x1t.cloudfront.net/images/items/{value}/1200/{value}.jpg',
    property: 'code',
    propertyTransformer: isbn => isbn.replace(/-/g, ''),
    find: directUrl
  },
  {
    name: 'Veneta',
    url: 'https://veneta.com.br',
    searchWith: 'title',
    collection: 'product',
    find: wordpress
  },
  {
    name: 'Vertical',
    url: 'https://readvertical.com',
    searchWith: 'code',
    collection: 'product',
    queryTransformer: isbn => isbn.replace(/-/g, ''),
    find: wordpress
  },
  {
    name: 'VIZ Media',
    url: 'https://dw9to29mmj727.cloudfront.net/products/{value}.jpg',
    property: 'code',
    propertyTransformer: isbn => convertIsbn13ToIsbn10(isbn.replace(/-/g, '')),
    find: directUrl
  },
  {
    name: 'Zarabatana',
    url: 'https://zarabatana.com.br',
    searchWith: 'title',
    collection: 'product',
    queryParameter: 'slug',
    queryTransformer: title => slugify(title)
  }
]

export async function findCovers (book, forceAmazon) {
  if (forceAmazon) {
    return await AMAZON.find(book)
  }

  const siteHandler = AVAILABLE_SITES.find(site => site.name === book.imprint)

  if (!siteHandler) {
    return await AMAZON.find(book)
  }

  const imprintSiteResults = await siteHandler.find(book)
  const amazonResults = await AMAZON.find(book)

  return imprintSiteResults.concat(amazonResults)
}
