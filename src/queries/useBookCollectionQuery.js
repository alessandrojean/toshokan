import { computed } from 'vue'
import { useQuery } from 'vue-query'

import { useSheetStore } from '@/stores/sheet'
import getBooksFromCollection from '@/services/sheet/getBooksFromCollection'

export default function useBookCollectionQuery (book, { enabled }) {
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  async function fetcher () {
    return await getBooksFromCollection(sheetId.value, book.value)
  }

  const bookTitle = computed(() => book.value?.titleParts?.title + ' #')

  return useQuery(['book-collection', bookTitle], fetcher, { enabled })
}
