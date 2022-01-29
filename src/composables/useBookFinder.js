import { computed, readonly, ref } from 'vue'
import { useStore } from 'vuex'

import SheetService from '@/services/sheet'

export default function useBookFinder () {
  const store = useStore()

  const sheetId = computed(() => store.state.sheet.sheetId)
  const idMap = computed(() => store.state.collection.idMap)

  const book = ref(null)
  const bookFound = ref(false)
  const collection = ref(null)

  async function findTheBook (bookId, failCallback) {
    if (!bookId) {
      return
    }

    bookFound.value = false

    try {
      if (Object.keys(idMap.value).length === 0) {
        await store.dispatch('collection/fetchIdMap')
      }

      const theBook = await SheetService.getBookById(
        sheetId.value, idMap.value, bookId
      )

      if (!theBook && failCallback) {
        book.value = undefined
        failCallback()
        return
      }

      if (theBook.titleParts.number) {
        collection.value = await SheetService.getBooksFromCollection(
          sheetId.value, idMap.value, theBook
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
