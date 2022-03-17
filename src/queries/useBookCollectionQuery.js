import { computed } from 'vue'
import { useQuery } from 'vue-query'

import getBooksFromCollection from '@/services/sheet/getBooksFromCollection'
import { useSheetStore } from '@/stores/sheet'
import { fetch } from '@/util/gapi'

export default function useBookCollectionQuery(book, { enabled }) {
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  async function fetcher() {
    return await fetch(getBooksFromCollection(sheetId.value, book.value))
  }

  const bookTitle = computed(() => book.value?.titleParts?.title + ' #')

  return useQuery(['book-collection', bookTitle], fetcher, { enabled })
}
