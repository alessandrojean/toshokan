import groupBy from 'lodash.groupby'
import Pako from 'pako'

import {
  ToshokanBook,
  ToshokanDimension,
  ToshokanOwner,
  ToshokanPrice,
  ToshokanSheet,
  ToshokanStatus,
} from './schema/library'
import getVersion from '@/services/sheet/getVersion'
import getWholeLibrary from '@/services/sheet/getWholeLibrary'
import { useAuthStore } from '@/stores/auth'
import { useSheetStore } from '@/stores/sheet'
import type Book from '@/model/Book'
import { Status } from '@/model/Book'

const VERSION = 1
const TIMEZONE_OFFSET = -3 * 60 // - 3 hours

function fixDateTimeZone(date: Date | null, full = false) {
  if (!date) {
    return undefined
  }

  if (!(date instanceof Date)) {
    return date
  }

  const newDate = new Date(date)
  newDate.setMinutes(date.getMinutes() + TIMEZONE_OFFSET)
  return newDate.toISOString().substring(0, full ? 19 : 10)
}

export function parseFile(fileDataGzipped: Uint8Array) {
  const fileData = Pako.ungzip(fileDataGzipped)

  const message = ToshokanSheet.decode(fileData)

  return ToshokanSheet.toObject(message, { enums: String, defaults: true })
}

export function parseFileSingle(fileDataGzipped: Uint8Array) {
  const fileData = Pako.ungzip(fileDataGzipped)

  const message = ToshokanBook.decode(fileData)

  return ToshokanBook.toObject(message, {
    enums: String,
    defaults: true,
  }) as ToshokanBook
}

const statusMap: Record<Status, ToshokanStatus> = {
  [Status.READ]: ToshokanStatus.READ,
  [Status.UNREAD]: ToshokanStatus.UNREAD,
  [Status.FUTURE]: ToshokanStatus.FUTURE,
}

function mapBookToMessage(
  book: Book,
  sheetVersion: number,
  owner: ToshokanOwner | undefined | null,
): ToshokanBook {
  return ToshokanBook.fromObject({
    code: book.code!.trim(),
    group: book.group!.trim(),
    title: book.title!.trim(),
    authors: book.authors!,
    publisher: book.publisher!.trim(),
    dimensions: ToshokanDimension.fromObject(book.dimensions!),
    status: statusMap[book.status!],
    readAt: fixDateTimeZone(book.readAt),
    labelPrice: ToshokanPrice.fromObject(book.labelPrice!),
    paidPrice: ToshokanPrice.fromObject(book.paidPrice!),
    store: book.store!.trim(),
    coverUrl: !book.coverUrl?.length ? undefined : book.coverUrl.trim(),
    boughtAt: fixDateTimeZone(book.boughtAt),
    favorite: book.favorite!,
    synopsis: !book.synopsis?.length ? undefined : book.synopsis.trim(),
    notes: !book.notes?.length ? undefined : book.notes.trim(),
    tags: book.tags.map(
      tag => tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase(),
    ),
    createdAt: fixDateTimeZone(book.createdAt, true),
    updatedAt: fixDateTimeZone(book.updatedAt, true),
    sheetVersion,
    owner,
  })
}

export function generateFile(
  library: Book[],
  sheetVersion: number,
  owner: ToshokanOwner | undefined | null,
) {
  const authors = new Set(library.flatMap(book => book.authors!))
  const tags = new Set(
    library.flatMap((book) => {
      return book.tags.map(
        tag => tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase(),
      )
    }),
  )

  const sheet = new ToshokanSheet({
    version: VERSION,
    sheetVersion,
    groups: Object.keys(groupBy(library, book => book.group!.trim())).sort(),
    tags: Array.from(tags).sort(),
    publishers: Object.keys(
      groupBy(library, book => book.publisher!.trim()),
    ).sort(),
    stores: Object.keys(groupBy(library, book => book.store!.trim())).sort(),
    authors: Array.from(authors).sort(),
    library: library.map(book => mapBookToMessage(book, sheetVersion, owner)),
    owner,
  })

  const sheetEncoded = ToshokanSheet.encode(sheet).finish()
  return Pako.gzip(sheetEncoded)
}

export function generateFileSingle(
  book: Book,
  sheetVersion: number,
  owner: ToshokanOwner | undefined | null,
) {
  const bookMessage = mapBookToMessage(book, sheetVersion, owner)

  const bookEncoded = ToshokanBook.encode(bookMessage).finish()
  return Pako.gzip(bookEncoded)
}

export default async function androidExport(anonymous?: boolean) {
  const sheetStore = useSheetStore()
  const sheetId = sheetStore.sheetId!

  const authStore = useAuthStore()
  const owner = new ToshokanOwner({
    name: authStore.profileName!,
    pictureUrl: authStore.profileImageUrl!,
  })

  const library = await getWholeLibrary(sheetId)
  const sheetVersion = await getVersion(sheetId)
  const file = generateFile(
    library,
    sheetVersion,
    anonymous ? undefined : owner,
  )
  const blob = new Blob([file], {
    type: 'application/gzip',
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

export function downloadUrl(data: string, fileName: string) {
  const anchor = document.createElement('a')
  anchor.href = data
  anchor.download = fileName
  anchor.style.display = 'none'

  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
}
