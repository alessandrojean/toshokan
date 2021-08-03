import { computed, ref } from 'vue'
import { useStore } from 'vuex'

import { getBookById, getBookNeighbors } from '@/services/sheet'

export default function useBookFinder () {
  const store = useStore()

  const sheetId = computed(() => store.state.sheet.sheetId)
  const idMap = computed(() => store.state.collection.idMap)

  const book = ref()
  const bookFound = ref(false)
  const previousBook = ref()
  const nextBook = ref()

  async function findTheBook (bookId, failCallback) {
    if (!bookId) {
      return
    }

    bookFound.value = false

    try {
      if (Object.keys(idMap.value).length === 0) {
        await store.dispatch('collection/fetchIdMap')
      }

      const theBook = await getBookById(sheetId.value, idMap.value, bookId)

      console.log(theBook)

      if (!theBook && failCallback) {
        book.value = undefined
        failCallback()
        return
      }

      if (theBook.titleParts[1]) {
        const neighbors = await getBookNeighbors(sheetId.value, idMap.value, theBook)

        if (neighbors) {
          previousBook.value = neighbors.previous
          nextBook.value = neighbors.next
        }
      }

      bookFound.value = true
      book.value = theBook
    } catch (e) {
      console.error(e)
      bookFound.value = false
      book.value = undefined
    }
  }

  return {
    book,
    bookFound,
    findTheBook,
    previousBook,
    nextBook
  }
}
