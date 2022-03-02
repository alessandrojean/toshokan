import Book, { STATUS_READ } from '@/model/Book'
import dedent from 'dedent'

const testBook = new Book({
  sheetLocation: 'Collection!B5',
  row: 5,
  id: 'q8fTXeCnqswlbaYR33Iy4',
  code: '9786589912415',
  title: 'Frankenstein e outras histórias de horror',
  authors: ['Junji Ito'],
  synopsis: dedent`
    A saga do ambicioso Victor Frankenstein, que dá vida a uma criatura
    monstruosa feita de cadáveres para se aproximar do patamar de Deus por
    meio da ciência, também inspirou o aclamado autor de mangás Junji Ito a
    adaptá-la para os quadrinhos entre 1994 e 1998, com seu traço e narrativa
    que destacam o grotesco. Sua versão também foi um sucesso, considerada
    pela crítica como uma das melhores já feitas dessa história e agraciada
    em 2019 com o Prêmio Eisner de Melhor Adaptação de Outra Mídia.
  `,
  group: 'Mangás',
  publisher: 'Pipoca & Nanquim',
  dimensions: {
    width: 15,
    height: 22
  },
  paidPrice: {
    currency: 'BRL',
    value: 72.9
  },
  labelPrice: {
    currency: 'BRL',
    value: 72.9
  },
  store: 'Amazon',
  status: STATUS_READ,
  coverUrl:
    'https://pipocaenanquim.com.br/wp-content/uploads/2021/11/A1uvtpMPsfL.jpeg',
  boughtAt: new Date('2022-02-22'),
  readAt: new Date('2022-02-22'),
  createdAt: new Date('2022-02-22T21:00:00.000Z'),
  updatedAt: new Date('2022-02-22T21:00:00.000Z')
})

it('Should format to insert in the sheet correctly', () => {
  const bookFormatted = testBook.toArray()

  expect(bookFormatted).toHaveLength(23)
  expect(bookFormatted.slice(0, 22)).toStrictEqual([
    '=ROW()',
    testBook.id,
    testBook.code,
    testBook.group,
    testBook.title,
    testBook.authorsStr,
    testBook.publisher,
    [testBook.dimensions.width, '×', testBook.dimensions.height].join(' '),
    testBook.status,
    '=DATE(2022, 2, 21)',
    testBook.labelPrice.currency,
    '72.90',
    testBook.paidPrice.currency,
    '72.90',
    testBook.store,
    testBook.coverUrl,
    '=DATE(2022, 2, 21)',
    '',
    testBook.synopsis,
    '',
    '',
    '=DATE(2022, 2, 22) + TIME(18, 0, 0)'
  ])
})

it('Should parse the book from the sheet correctly', () => {
  const formattedBook = testBook.toArray()
  const book = Book.fromDataTable(formattedBook)

  expect(book).toBeInstanceOf(Book)
  expect(book).toMatchObject({
    id: testBook.id,
    code: testBook.code,
    title: testBook.title
  })
})

it('Should split the titles correctly', () => {
  const titles = {
    'Ao no Flag #01': {
      title: 'Ao no Flag',
      number: '01',
      main: 'Ao no Flag #01',
      subtitle: null
    },
    'AKIRA #01: Part 1 - Tetsuo': {
      title: 'AKIRA',
      number: '01',
      main: 'AKIRA #01',
      subtitle: 'Part 1 - Tetsuo'
    },
    Gyo: {
      title: 'Gyo',
      number: null,
      main: 'Gyo',
      subtitle: null
    }
  }

  for (const [title, titleParts] of Object.entries(titles)) {
    expect(new Book({ title }).titleParts).toStrictEqual(titleParts)
  }
})

it('Should detect the correct code type', () => {
  const codes = {
    // eslint-disable-next-line
    '9788545702870': 'ISBN-13',
    // eslint-disable-next-line
    '8576161877': 'ISBN-10',
    // eslint-disable-next-line
    '7897780165585': 'EAN-13',
    'a-random-string': 'ID',
    'N/A': 'N/A'
  }

  for (const [code, type] of Object.entries(codes)) {
    expect(Book.getCodeType(code)).toBe(type)
  }
})
