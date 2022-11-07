import {
  vi,
  describe,
  it,
  expect,
  beforeEach,
  beforeAll,
  SpyInstance
} from 'vitest'

import QueryBuilder from '@/data/QueryBuilder'
import Book, {
  CollectionColumns,
  FAVORITE_ACTIVE,
  PropertyToColumn,
  STATUS_FUTURE,
  STATUS_READ
} from '@/model/Book'
import SheetService from '@/services/sheet'
import { PER_PAGE } from '@/services/sheet/constants'

describe('Sheet service', () => {
  const setQueryMock = vi.fn()
  const queryToString = vi.spyOn(
    QueryBuilder.prototype,
    'toString'
  ) as unknown as SpyInstance<[], QueryBuilder>

  const queryMock = vi.fn().mockReturnValue({
    send: (resultFn: Function) =>
      resultFn({
        getDataTable: vi.fn().mockReturnValue({
          getNumberOfColumns: vi.fn().mockReturnValue(0),
          getNumberOfRows: vi.fn().mockReturnValue(0)
        }),
        isError: vi.fn().mockReturnValue(false)
      }),
    setQuery: setQueryMock
  })

  beforeAll(() => {
    // @ts-ignore
    global.google = { visualization: { Query: queryMock } }
  })

  beforeEach(() => {
    setQueryMock.mockClear()
    queryMock.mockClear()
    queryToString.mockClear()
  })

  it('Should build the query URL correctly', () => {
    const queryUrl = new URL(SheetService.buildSheetUrl('TEST_SHEET_ID'))
    // @ts-ignore
    const searchParams = Object.fromEntries(queryUrl.searchParams)

    expect(searchParams).toEqual({
      range: 'B4:X',
      sheet: 'Collection',
      headers: '1'
    })

    expect(queryUrl.pathname).toBe('/spreadsheets/d/TEST_SHEET_ID/gviz/tq')
  })

  it('Should build the books by code query correctly', async () => {
    const { CODE } = CollectionColumns
    await SheetService.getBookByCode('TEST_SHEET_ID', 'BOOK_CODE')

    expect(queryToString).toHaveBeenCalled()
    expect(queryToString.mock.instances[0].toObject()).toMatchObject({
      select: [],
      where: { restrictions: [[CODE, '=', 'BOOK_CODE']] }
    })
    expect(setQueryMock).toHaveBeenCalled()
  })

  it('Should build the find book by id query correctly', async () => {
    const { ID } = CollectionColumns
    await SheetService.getBookById('TEST_SHEET_ID', 'ID')

    expect(queryToString).toHaveBeenCalled()
    expect(queryToString.mock.instances[0].toObject()).toMatchObject({
      select: [],
      where: { restrictions: [[ID, '=', 'ID']] }
    })
    expect(setQueryMock).toHaveBeenCalled()
  })

  it('Should build the book neighbors query correctly', async () => {
    const testBook = new Book({
      title: 'Ao no Flag #01',
      publisher: 'Panini',
      group: 'Manga'
    })

    const { TITLE, PUBLISHER, GROUP } = CollectionColumns
    await SheetService.getBookNeighbors('TEST_SHEET_ID', testBook)

    expect(queryToString).toHaveBeenCalled()
    expect(queryToString.mock.instances[0].toObject()).toMatchObject({
      select: [],
      where: {
        restrictions: [
          [TITLE, 'starts with', testBook.titleParts.title],
          [PUBLISHER, '=', testBook.publisher],
          [GROUP, '=', testBook.group]
        ]
      },
      orderBy: [[TITLE, 'asc']]
    })
    expect(setQueryMock).toHaveBeenCalled()
  })

  it('Should build the book collection query correctly', async () => {
    const testBook = new Book({
      title: 'Ao no Flag #01',
      publisher: 'Panini',
      group: 'Manga'
    })

    const { TITLE, PUBLISHER, GROUP } = CollectionColumns
    await SheetService.getBooksFromCollection('TEST_SHEET_ID', testBook)

    expect(queryToString).toHaveBeenCalled()
    expect(queryToString.mock.instances[0].toObject()).toMatchObject({
      select: [],
      where: {
        restrictions: [
          [TITLE, 'starts with', testBook.titleParts.title + ' #'],
          [PUBLISHER, '=', testBook.publisher],
          [GROUP, '=', testBook.group]
        ]
      },
      orderBy: [[TITLE, 'asc']]
    })
    expect(setQueryMock).toHaveBeenCalled()
  })

  it('Should build the column unique values query correctly', async () => {
    const { STORE } = CollectionColumns
    await SheetService.getColumnUniqueValues('TEST_SHEET_ID', STORE)

    expect(queryToString).toHaveBeenCalled()
    expect(queryToString.mock.instances[0].toObject()).toMatchObject({
      select: [STORE, `count(${STORE})`],
      where: { restrictions: [] },
      orderBy: [
        [`count(${STORE})`, 'desc'],
        [STORE, 'asc']
      ]
    })

    queryToString.mockClear()

    await SheetService.getColumnUniqueValues('TEST_SHEET_ID', STORE, true)

    expect(queryToString).toHaveBeenCalled()
    expect(queryToString.mock.instances[0].toObject()).toMatchObject({
      select: [STORE, `count(${STORE})`],
      where: { restrictions: [] },
      orderBy: [[STORE, 'asc']]
    })

    expect(setQueryMock).toHaveBeenCalled()
  })

  it('Should build the group statistics query correctly', async () => {
    const { GROUP, STATUS } = CollectionColumns
    await SheetService.getGroups('TEST_SHEET_ID')

    expect(queryToString).toHaveBeenCalled()
    expect(queryToString.mock.instances[0].toObject()).toMatchObject({
      select: [GROUP, STATUS, `count(${GROUP})`],
      where: {
        restrictions: [[GROUP, 'is not', 'null']]
      },
      groupBy: [GROUP, STATUS]
    })
    expect(setQueryMock).toHaveBeenCalled()
  })

  it('Should build the latest readings query correctly', async () => {
    const { STATUS, READ_AT, UPDATED_AT } = CollectionColumns
    await SheetService.getLatestReadings('TEST_SHEET_ID')

    expect(queryToString).toHaveBeenCalled()
    expect(queryToString.mock.instances[0].toObject()).toMatchObject({
      select: [],
      where: {
        restrictions: [
          [READ_AT, 'is not', 'null'],
          [STATUS, '=', STATUS_READ]
        ]
      },
      orderBy: [
        [READ_AT, 'desc'],
        [UPDATED_AT, 'desc']
      ]
    })
    expect(setQueryMock).toHaveBeenCalled()
  })

  it('Should build the next reads query correctly', async () => {
    const { STATUS, READ_AT, TITLE, UPDATED_AT } = CollectionColumns
    await SheetService.getNextReads('TEST_SHEET_ID')

    expect(queryToString).toHaveBeenCalled()
    expect(queryToString.mock.instances[0].toObject()).toMatchObject({
      select: [],
      where: {
        restrictions: [
          [READ_AT, 'is not', 'null'],
          [STATUS, '=', STATUS_READ],
          [`dateDiff(now(), ${READ_AT})`, '<=', 6 * 30]
        ]
      },
      orderBy: [
        [READ_AT, 'desc'],
        [UPDATED_AT, 'desc'],
        [TITLE, 'desc']
      ]
    })
    expect(setQueryMock).toHaveBeenCalled()
  })

  describe('Book search', () => {
    it('Should build the query correctly (advanced search)', async () => {
      const { AUTHORS, READ_AT, TITLE, UPDATED_AT } = CollectionColumns
      await SheetService.searchBooks({
        sheetId: 'TEST_SHEET_ID',
        searchTerm: 'AKIRA author:otomo read-after:2021-12-31',
        page: 1
      })

      expect(queryToString).toHaveBeenCalled()
      expect(queryToString.mock.instances[0].toObject()).toMatchObject({
        select: [],
        where: {
          restrictions: [
            [`lower(${AUTHORS})`, 'matches', '.*otomo.*'],
            {
              operator: QueryBuilder.AND,
              restrictions: [
                [READ_AT, 'is not', 'null'],
                [READ_AT, '> date', '2021-12-31']
              ]
            },
            [`lower(${TITLE})`, 'matches', '.*akira.*']
          ]
        },
        orderBy: [[UPDATED_AT, 'desc']]
      })
      expect(setQueryMock).toHaveBeenCalled()
    })

    it('Should build the query correctly (with dates)', async () => {
      const { GROUP, READ_AT, UPDATED_AT } = CollectionColumns
      await SheetService.searchBooks({
        sheetId: 'TEST_SHEET_ID',
        searchTerm: 'group:manga read-at:2021-12',
        page: 1
      })

      expect(queryToString).toHaveBeenCalled()
      expect(queryToString.mock.instances[0].toObject()).toMatchObject({
        select: [],
        where: {
          restrictions: [
            [`lower(${GROUP})`, '=', 'manga'],
            {
              operator: QueryBuilder.AND,
              restrictions: [
                [READ_AT, 'is not', 'null'],
                {
                  operator: QueryBuilder.AND,
                  restrictions: [
                    [READ_AT, '>= date', '2021-12-01'],
                    [READ_AT, '<= date', '2021-12-31']
                  ]
                }
              ]
            }
          ]
        },
        orderBy: [[UPDATED_AT, 'desc']]
      })
      expect(setQueryMock).toHaveBeenCalled()
    })
  })

  describe('Books general query', () => {
    it('Should build the query correctly (default params)', async () => {
      const { CREATED_AT } = CollectionColumns
      await SheetService.getBooks('TEST_SHEET_ID')

      expect(queryToString).toHaveBeenCalled()
      expect(queryToString.mock.instances[0].toObject()).toMatchObject({
        select: [],
        where: { restrictions: [] },
        orderBy: [[CREATED_AT, 'desc']],
        limit: PER_PAGE,
        offset: 0
      })
      expect(setQueryMock).toHaveBeenCalled()
    })

    it('Should build the query correctly (nth page)', async () => {
      const page = 5

      const { CREATED_AT } = CollectionColumns
      await SheetService.getBooks('TEST_SHEET_ID', page)

      expect(queryToString).toHaveBeenCalled()
      expect(queryToString.mock.instances[0].toObject()).toMatchObject({
        select: [],
        where: { restrictions: [] },
        orderBy: [[CREATED_AT, 'desc']],
        limit: PER_PAGE,
        offset: (page - 1) * PER_PAGE
      })
      expect(setQueryMock).toHaveBeenCalled()
    })

    it('Should build the query correctly (with groups)', async () => {
      const { CREATED_AT, GROUP } = CollectionColumns
      await SheetService.getBooks('TEST_SHEET_ID', 1, { groups: ['Manga'] })

      expect(queryToString).toHaveBeenCalled()
      expect(queryToString.mock.instances[0].toObject()).toMatchObject({
        select: [],
        where: {
          restrictions: [
            {
              operator: QueryBuilder.OR,
              restrictions: [[GROUP, '=', 'Manga']]
            }
          ]
        },
        orderBy: [[CREATED_AT, 'desc']]
      })
      expect(setQueryMock).toHaveBeenCalled()
    })

    it('Should build the query correctly (with future items)', async () => {
      const { CREATED_AT, STATUS } = CollectionColumns
      await SheetService.getBooks('TEST_SHEET_ID', 1, { futureItems: 'only' })

      expect(queryToString).toHaveBeenCalled()
      expect(queryToString.mock.instances[0].toObject()).toMatchObject({
        select: [],
        where: {
          restrictions: [[STATUS, '=', STATUS_FUTURE]]
        },
        orderBy: [[CREATED_AT, 'desc']]
      })

      queryToString.mockClear()

      await SheetService.getBooks('TEST_SHEET_ID', 1, { futureItems: 'hide' })
      expect(queryToString.mock.instances[0].toObject()).toMatchObject({
        where: {
          restrictions: [[STATUS, '!=', STATUS_FUTURE]]
        }
      })

      expect(setQueryMock).toHaveBeenCalled()
    })

    it('Should build the query correctly (with favorites)', async () => {
      const { CREATED_AT, FAVORITE } = CollectionColumns
      await SheetService.getBooks('TEST_SHEET_ID', 1, { favorites: 'only' })

      expect(queryToString).toHaveBeenCalled()
      expect(queryToString.mock.instances[0].toObject()).toMatchObject({
        select: [],
        where: {
          restrictions: [[FAVORITE, '=', FAVORITE_ACTIVE]]
        },
        orderBy: [[CREATED_AT, 'desc']]
      })
      expect(setQueryMock).toHaveBeenCalled()
    })

    it('Should build the query correctly (with currency order by)', async () => {
      const { LABEL_PRICE_VALUE, LABEL_PRICE_CURRENCY } = CollectionColumns
      await SheetService.getBooks('TEST_SHEET_ID', 1, {
        orderBy: PropertyToColumn['labelPrice.value'],
        orderDirection: 'asc'
      })

      expect(queryToString).toHaveBeenCalled()
      expect(queryToString.mock.instances[0].toObject()).toMatchObject({
        select: [],
        where: { restrictions: [] },
        orderBy: [
          [LABEL_PRICE_CURRENCY, 'asc'],
          [LABEL_PRICE_VALUE, 'asc']
        ]
      })
      expect(setQueryMock).toHaveBeenCalled()
    })

    it("Should build the query correctly (with don't count)", async () => {
      const { CREATED_AT } = CollectionColumns
      await SheetService.getBooks('TEST_SHEET_ID', 1, { dontCount: true })

      expect(queryToString).toHaveBeenCalled()
      expect(queryToString.mock.instances[0].toObject()).toMatchObject({
        select: [],
        where: { restrictions: [] },
        orderBy: [[CREATED_AT, 'desc']]
      })
      expect(setQueryMock).toHaveBeenCalledTimes(1)
    })
  })
})
