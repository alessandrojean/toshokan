import slugify from 'slugify'

import { convertIsbn13ToIsbn10 } from '@/util/isbn'
import UrlReplacerFinder from './UrlReplacerFinder'
import WordPressFinder from './WordPressFinder'

export const AMAZON = new UrlReplacerFinder({
  url: 'https://images-na.ssl-images-amazon.com/images/P/{value}.01._SCRM_SL700_.jpg',
  condition: (book) => book.codeType.includes('ISBN'),
  property: 'code',
  propertyTransformer: (isbn) => {
    isbn = isbn.replace(/-/g, '')

    if (isbn.length === 10) {
      return isbn
    }

    return convertIsbn13ToIsbn10(isbn)
  }
})

const AVAILABLE_SITES = [
  // Wordpress send multiple CORS headers.
  // new OEmbedFinder({
  //   name: 'JBC',
  //   baseUrl: 'https://editorajbc.com.br',
  //   createPath: book => {
  //     const series = slugify(book.titleParts.title).replace('especial', 'esp')
  //     const title = slugify(book.title).replace('especial', 'esp')
  //
  //     return `/mangas/colecao/${series}/vol/${title}`
  //   }
  // }),
  new WordPressFinder({
    name: 'Mino',
    url: 'https://editoramino.com',
    searchWith: 'title',
    collection: 'project'
  }),
  new WordPressFinder({
    name: 'NewPOP',
    url: 'https://www.newpop.com.br',
    searchWith: 'code'
  }),
  new WordPressFinder({
    name: 'Pipoca & Nanquim',
    url: 'https://pipocaenanquim.com.br',
    searchWith: 'title',
    collection: 'product'
  }),
  new UrlReplacerFinder({
    name: 'Shueisha',
    url: 'https://dosbg3xlm0x1t.cloudfront.net/images/items/{value}/1200/{value}.jpg',
    property: 'code',
    propertyTransformer: (isbn) => isbn.replace(/-/g, '')
  }),
  new WordPressFinder({
    name: 'Veneta',
    url: 'https://veneta.com.br',
    searchWith: 'title',
    collection: 'product'
  }),
  new WordPressFinder({
    name: 'Vertical',
    url: 'https://readvertical.com',
    searchWith: 'code',
    collection: 'product',
    queryTransformer: (isbn) => isbn.replace(/-/g, '')
  }),
  new UrlReplacerFinder({
    name: 'VIZ Media',
    url: 'https://dw9to29mmj727.cloudfront.net/products/{value}.jpg',
    property: 'code',
    propertyTransformer: (isbn) => convertIsbn13ToIsbn10(isbn.replace(/-/g, ''))
  }),
  new WordPressFinder({
    name: 'Zarabatana',
    url: 'https://zarabatana.com.br',
    searchWith: 'title',
    collection: 'product',
    queryParameter: 'slug',
    queryTransformer: (title) => slugify(title)
  })
]

/**
 * Find the covers for a book.
 *
 * @param {import('@/model/Book').default} book The book
 * @param {boolean?} forceAmazon If true, will only search on Amazon
 * @returns {Promise<string[]?>} The covers found
 */
export async function findCovers(book, forceAmazon) {
  if (forceAmazon) {
    return await AMAZON.find(book)
  }

  const siteHandler = AVAILABLE_SITES.find(
    (site) => site.name === book.publisher
  )

  if (!siteHandler) {
    return await AMAZON.find(book)
  }

  const publisherSiteResults = await siteHandler.find(book)
  const amazonResults = await AMAZON.find(book)

  return publisherSiteResults.concat(amazonResults)
}
