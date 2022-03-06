import axios from 'axios'

import Book from '@/model/Book'
import { findCovers } from '@/services/cover'
import UrlReplacerFinder from '@/services/cover/UrlReplacerFinder'
import WordPressFinder from '@/services/cover/WordPressFinder'

const axiosGet = jest.spyOn(axios, 'get')
const axiosPost = jest.spyOn(axios, 'post')

beforeEach(() => {
  axiosGet.mockClear()
  axiosPost.mockClear()
})

it('Should replace the value in URL replacer', async () => {
  const urlReplacer = new UrlReplacerFinder({
    name: 'Test publisher',
    url: 'https://cool.api.dev/isbn/{value}.jpg',
    property: 'code'
  })

  const coverUrls = await urlReplacer.find(new Book({ code: '12345' }))

  expect(coverUrls).toStrictEqual(['https://cool.api.dev/isbn/12345.jpg'])
})

it('Should find the cover in WordPress if available', async () => {
  axiosGet.mockResolvedValueOnce({
    data: [
      {
        _embedded: {
          'wp:featuredmedia': [{ source_url: 'COVER_URL' }]
        }
      }
    ]
  })

  const wordpress = new WordPressFinder({
    name: 'Test publisher',
    url: 'https://cool.publisher.dev',
    searchWith: 'code'
  })

  const coverUrls = await wordpress.find(new Book({ code: '12345' }))

  expect(coverUrls).toStrictEqual(['COVER_URL'])
})

it('Should return no results in WordPress if not available', async () => {
  axiosGet.mockResolvedValueOnce({ data: [] })

  const wordpress = new WordPressFinder({
    name: 'Test publisher',
    url: 'https://cool.publisher.dev',
    searchWith: 'code'
  })

  const coverUrls = await wordpress.find(new Book({ code: '12345' }))

  expect(coverUrls).toHaveLength(0)
})

it('Should check only on Amazon when forced', async () => {
  axiosGet.mockResolvedValue({ data: [] })

  const book = new Book({ code: '9786589912415' })

  await expect(findCovers(book, true)).resolves.toStrictEqual([
    'https://images-na.ssl-images-amazon.com/images/P/6589912416.01._SCRM_SL700_.jpg'
  ])
})

it('Should return no results if book does not have a ISBN', async () => {
  const book = new Book({ code: '12345' })

  await expect(findCovers(book)).resolves.toHaveLength(0)
})
