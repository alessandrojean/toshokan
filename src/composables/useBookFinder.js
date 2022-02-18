import { computed, readonly, ref } from 'vue'

import SheetService from '@/services/sheet'
import { useSheetStore } from '@/stores/sheet'

export default function useBookFinder () {
  const sheetStore = useSheetStore()

  const sheetId = computed(() => sheetStore.sheetId)

  const book = ref(null)
  const bookFound = ref(false)
  const collection = ref(null)

  async function findTheBook (bookId, failCallback) {
    if (!bookId) {
      return
    }

    bookFound.value = false

    try {
      const theBook = await SheetService.getBookById(sheetId.value, bookId)

      if (!theBook && failCallback) {
        book.value = undefined
        failCallback()
        return
      }

      if (theBook.titleParts.number) {
        collection.value = await SheetService.getBooksFromCollection(
          sheetId.value, theBook
        )
      }

      bookFound.value = true
      book.value = theBook
    } catch (e) {
      bookFound.value = false
      book.value = undefined
    }
  }

  function clearBook () {
    book.value = null
    bookFound.value = false
    collection.value = null
  }

  return {
    book: readonly(book),
    bookFound: readonly(bookFound),
    findTheBook,
    clearBook,
    collection: readonly(collection)
  }
}
