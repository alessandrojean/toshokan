import { beforeEach, vi, describe, it, expect, afterEach } from 'vitest'

import { Axios } from 'axios'

import Cbl from '@/services/lookup/Cbl'
import GoogleBooks from '@/services/lookup/GoogleBooks'
import OpenLibrary from '@/services/lookup/OpenLibrary'

const axiosGet = vi.spyOn(Axios.prototype, 'get')
const axiosPost = vi.spyOn(Axios.prototype, 'post')

beforeEach(() => {
  axiosGet.mockClear()
  axiosPost.mockClear()
})

describe('CBL', () => {
  beforeEach(() => {
    process.env.VITE_APP_CBL_QUERY_KEY = 'CBL_QUERY_KEY'
  })

  afterEach(() => {
    process.env.VITE_APP_CBL_QUERY_KEY = undefined
  })

  it('Should parse the book if found', async () => {
    axiosPost.mockResolvedValueOnce({
      data: {
        value: [
          {
            Authors: ['Katsuhiro Otomo', 'Drik Sada'],
            Imprint: 'Editora JBC',
            Title: 'Akira',
            RowKey: '9788545702870',
            FormattedKey: '9788545702870',
            Profissoes: ['Autor', 'Tradutor'],
            Dimensao: '178x256',
            Sinopse: null
          }
        ]
      }
    })

    const cbl = new Cbl()
    const results = await cbl.search('9788545702870')

    expect(results).toHaveLength(1)
    expect(results[0]).toMatchObject({
      code: '9788545702870',
      title: 'Akira',
      authors: ['Katsuhiro Otomo'],
      publisher: 'JBC',
      dimensions: {
        width: 17.8,
        height: 25.6
      },
      synopsis: '',
      provider: 'CBL'
    })
  })

  it('Should return no results if ISBN does not exists', async () => {
    axiosPost.mockResolvedValueOnce({
      data: { value: [] }
    })

    const cbl = new Cbl()
    const results = await cbl.search('9788545702870')

    expect(results).toHaveLength(0)
  })

  it('Should fail if the ISBN is invalid', async () => {
    const cbl = new Cbl()
    const search = vi.spyOn(cbl, 'search')

    await expect(cbl.search('9788545702871')).rejects.toThrowError(
      'The informed ISBN is invalid.'
    )

    expect(search).toHaveBeenCalled()
  })

  it('Should fail if no query key is provided', async () => {
    delete process.env.VITE_APP_CBL_QUERY_KEY

    const cbl = new Cbl()
    vi.spyOn(cbl, 'search')

    await expect(cbl.search('9788545702870')).rejects.toThrowError(
      'Authorization key missing.'
    )
  })
})

describe('Google Books', () => {
  it('Should parse the book if found', async () => {
    axiosGet.mockResolvedValueOnce({
      data: {
        items: [
          {
            volumeInfo: {
              title: 'Akira vol. 1',
              authors: ['Katsuhiro Otomo'],
              publisher: 'Editora JBC',
              industryIdentifiers: [
                { type: 'ISBN_13', identifier: '9788545702870' }
              ],
              dimensions: {
                width: '17.8 cm',
                height: '25.6 cm'
              }
            }
          }
        ]
      }
    })

    const googleBooks = new GoogleBooks()
    const results = await googleBooks.search('9788545702870')

    expect(results).toHaveLength(1)
    expect(results[0]).toMatchObject({
      code: '9788545702870',
      title: 'Akira #01',
      authors: ['Katsuhiro Otomo'],
      publisher: 'Editora JBC',
      dimensions: {
        width: 17.8,
        height: 25.6
      },
      synopsis: '',
      provider: 'Google Books'
    })
  })

  it('Should return no results if ISBN does not exists', async () => {
    axiosGet.mockResolvedValueOnce({
      data: { totalItems: 0 }
    })

    const googleBooks = new GoogleBooks()
    const results = await googleBooks.search('9788545702870')

    expect(results).toHaveLength(0)
  })

  it('Should fail if the ISBN is invalid', async () => {
    const googleBooks = new GoogleBooks()
    const search = vi.spyOn(googleBooks, 'search')

    await expect(googleBooks.search('9788545702871')).rejects.toThrowError(
      'The informed ISBN is invalid.'
    )

    expect(search).toHaveBeenCalled()
  })
})

describe('Open Library', () => {
  it('Should parse the book if found', async () => {
    axiosGet.mockResolvedValueOnce({
      data: {
        'ISBN:9788545702870': {
          identifiers: {
            isbn_13: ['9788545702870']
          },
          title: 'Akira vol. 1',
          authors: [{ name: 'Katsuhiro Otomo' }],
          publishers: [{ name: 'Editora JBC' }]
        }
      }
    })

    axiosGet.mockResolvedValueOnce({
      data: {
        physical_dimensions: '25.6 x 17.8 x 1 centimeters'
      }
    })

    const openLibrary = new OpenLibrary()
    const results = await openLibrary.search('9788545702870')

    expect(results).toHaveLength(1)
    expect(results[0]).toMatchObject({
      code: '9788545702870',
      title: 'Akira #01',
      authors: ['Katsuhiro Otomo'],
      publisher: 'Editora JBC',
      dimensions: {
        width: 17.8,
        height: 25.6
      },
      synopsis: '',
      coverUrl: '',
      provider: 'Open Library'
    })
  })

  it('Should return no results if ISBN does not exists', async () => {
    axiosGet.mockResolvedValueOnce({ data: {} })

    const openLibrary = new OpenLibrary()
    const results = await openLibrary.search('9788545702870')

    expect(results).toHaveLength(0)
  })

  it('Should fail if the ISBN is invalid', async () => {
    const openLibrary = new OpenLibrary()
    const search = vi.spyOn(openLibrary, 'search')

    await expect(openLibrary.search('9788545702871')).rejects.toThrowError(
      'The informed ISBN is invalid.'
    )

    expect(search).toHaveBeenCalled()
  })
})
