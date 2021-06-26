import { computed, ref } from 'vue'
import { useStore } from 'vuex'

export default function useBookFinder () {
  const store = useStore()
  const collection = computed(() => store.state.sheet.collection)

  const book = ref()
  const bookFound = ref(false)
  const previousBook = ref()
  const nextBook = ref()

  const findTheBook = (bookId, failCallback) => {
    if (!bookId) {
      return
    }

    bookFound.value = false

    const theBook = Object.entries(collection.value)
      .flatMap(([, items]) => items)
      .find(item => item.id === bookId)

    if (!theBook && failCallback) {
      book.value = undefined
      failCallback()
      return
    }

    if (theBook.titleParts[1]) {
      const currentIdx = collection.value[theBook.collection]
        .findIndex(item => item.id === bookId)

      const prBook = collection.value[theBook.collection][currentIdx - 1]
      const nxBook = collection.value[theBook.collection][currentIdx + 1]

      if (prBook && prBook.titleParts[0] === theBook.titleParts[0] && prBook.imprint === theBook.imprint) {
        previousBook.value = prBook
      } else {
        previousBook.value = undefined
      }

      if (nxBook && nxBook.titleParts[0] === theBook.titleParts[0] && nxBook.imprint === theBook.imprint) {
        nextBook.value = nxBook
      } else {
        nextBook.value = undefined
      }
    }

    bookFound.value = true
    book.value = theBook
  }

  return {
    book,
    bookFound,
    findTheBook,
    previousBook,
    nextBook
  }
}
