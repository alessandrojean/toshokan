import Protobuf from 'protobufjs'
import groupBy from 'lodash.groupby'
import Pako from 'pako'

import getVersion from '@/services/sheet/getVersion'
import getWholeLibrary from '@/services/sheet/getWholeLibrary'
import { useAuthStore } from '@/stores/auth'
import { useSheetStore } from '@/stores/sheet'
import schema from './schema/library.proto?raw'

const VERSION = 1
const TIMEZONE_OFFSET = -3 * 60 // - 3 hours

function fixDateTimeZone(date, full = false) {
  if (!date) {
    return null
  }

  if (!(date instanceof Date)) {
    return date
  }

  date.setMinutes(date.getMinutes() + TIMEZONE_OFFSET)
  return date.toISOString().substring(0, full ? 19 : 10)
}

export function parseFile(fileDataGzipped) {
  const protobufRoot = Protobuf.parse(schema, { keepCase: true }).root
  const ToshokanSheet = protobufRoot.lookupType('toshokan.ToshokanSheet')

  const fileData = Pako.ungzip(fileDataGzipped)

  const message = ToshokanSheet.decode(fileData)

  return ToshokanSheet.toObject(message, { enums: String, defaults: true })
}

export function parseFileSingle(fileDataGzipped) {
  const protobufRoot = Protobuf.parse(schema, { keepCase: true }).root
  const ToshokanBook = protobufRoot.lookupType('toshokan.Book')

  const fileData = Pako.ungzip(fileDataGzipped)

  const message = ToshokanBook.decode(fileData)

  return ToshokanBook.toObject(message, { enums: String, defaults: true })
}

function mapBookToMessage(book, sheetVersion, owner) {
  return {
    code: book.code.trim(),
    group: book.group.trim(),
    title: book.title.trim(),
    authors: book.authors,
    publisher: book.publisher.trim(),
    dimensions: book.dimensions,
    status: book.status.trim(),
    readAt: fixDateTimeZone(book.readAt),
    labelPrice: book.labelPrice,
    paidPrice: book.paidPrice,
    store: book.store.trim(),
    coverUrl: !book.coverUrl?.length ? null : book.coverUrl.trim(),
    boughtAt: fixDateTimeZone(book.boughtAt),
    favorite: book.favorite,
    synopsis: !book.synopsis?.length ? null : book.synopsis.trim(),
    notes: !book.notes?.length ? null : book.notes.trim(),
    tags: book.tags.map(
      (tag) => tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase()
    ),
    createdAt: fixDateTimeZone(book.createdAt, true),
    updatedAt: fixDateTimeZone(book.updatedAt, true),
    sheetVersion,
    owner
  }
}

export function generateFile(library, sheetVersion, owner) {
  const protobufRoot = Protobuf.parse(schema, { keepCase: true }).root
  const ToshokanSheet = protobufRoot.lookupType('toshokan.ToshokanSheet')

  const authors = new Set(library.flatMap((book) => book.authors))
  const tags = new Set(
    library.flatMap((book) => {
      return book.tags.map(
        (tag) => tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase()
      )
    })
  )

  const sheet = {
    version: VERSION,
    sheetVersion: sheetVersion,
    groups: Object.keys(groupBy(library, (book) => book.group.trim())).sort(),
    tags: Array.from(tags).sort(),
    publishers: Object.keys(
      groupBy(library, (book) => book.publisher.trim())
    ).sort(),
    stores: Object.keys(groupBy(library, (book) => book.store.trim())).sort(),
    authors: Array.from(authors).sort(),
    library: library.map((book) => mapBookToMessage(book)),
    owner
  }

  const toshokanSheet = ToshokanSheet.fromObject(sheet)
  const sheetEncoded = ToshokanSheet.encode(toshokanSheet).finish()
  return Pako.gzip(sheetEncoded)
}

export function generateFileSingle(book, sheetVersion, owner) {
  const protobufRoot = Protobuf.parse(schema, { keepCase: true }).root
  const ToshokanBook = protobufRoot.lookupType('toshokan.Book')

  const bookMessage = ToshokanBook.fromObject(
    mapBookToMessage(book, sheetVersion, owner)
  )
  const bookEncoded = ToshokanBook.encode(bookMessage).finish()
  return Pako.gzip(bookEncoded)
}

export default async function androidExport(anonymous) {
  const sheetStore = useSheetStore()
  const sheetId = sheetStore.sheetId

  const authStore = useAuthStore()
  const owner = {
    name: authStore.profileName,
    pictureUrl: authStore.profileImageUrl
  }

  const library = await getWholeLibrary(sheetId)
  const sheetVersion = await getVersion(sheetId)
  const file = generateFile(library, sheetVersion, anonymous ? null : owner)
  const blob = new Blob([file], {
    type: 'application/gzip'
  })
  const url = URL.createObjectURL(blob)

  downloadUrl(url, createFileName())
  setTimeout(() => URL.revokeObjectURL(url))
}

export function createFileName() {
  const now = new Date()
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset())

  const nowString = now
    .toISOString()
    .substring(0, 19)
    .replace('T', '-')
    .replace(/:/g, '-')

  return `toshokan-sheet-${nowString}.proto.gz`
}

export function downloadUrl(data, fileName) {
  const anchor = document.createElement('a')
  anchor.href = data
  anchor.download = fileName
  anchor.style.display = 'none'

  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
}
