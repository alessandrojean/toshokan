import axios from 'axios'

import * as Cover from '@/services/cover'
import Book from '@/model/Book'

const axiosGet = jest.spyOn(axios, 'get')
const axiosPost = jest.spyOn(axios, 'post')

beforeEach(() => {
  axiosGet.mockClear()
  axiosPost.mockClear()
})

it('Should replace the value in direct URL', async () => {
  const directUrl = Cover.directUrl.bind({
    name: 'Test publisher',
    url: 'https://cool.api.dev/isbn/{value}.jpg',
    property: 'code'
  })

  await expect(directUrl(new Book({ code: '12345' }))).resolves.toStrictEqual([
    'https://cool.api.dev/isbn/12345.jpg'
  ])
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

  const wordpress = Cover.wordpress.bind({
    name: 'Test publisher',
    url: 'https://cool.publisher.dev',
    searchWith: 'code'
  })

  await expect(wordpress(new Book({ code: '12345' }))).resolves.toStrictEqual([
    'COVER_URL'
  ])
})

it('Should return no results in WordPress if not available', async () => {
  axiosGet.mockResolvedValueOnce({ data: [] })

  const wordpress = Cover.wordpress.bind({
    name: 'Test publisher',
    url: 'https://cool.publisher.dev',
    searchWith: 'code'
  })

  await expect(wordpress(new Book({ code: '12345' }))).resolves.toHaveLength(0)
})

it('Should check only on Amazon when forced', async () => {
  axiosGet.mockResolvedValue({ data: [] })

  const book = new Book({ code: '9786589912415' })

  await expect(Cover.findCovers(book, true)).resolves.toStrictEqual([
    'https://images-na.ssl-images-amazon.com/images/P/6589912416.01._SCRM_SL700_.jpg'
  ])
})

it('Should return no results if book does not have a ISBN', async () => {
  const book = new Book({ code: '12345' })

  await expect(Cover.findCovers(book)).resolves.toHaveLength(0)
})
