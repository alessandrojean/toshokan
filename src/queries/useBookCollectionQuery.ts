import { computed, type Ref } from 'vue'
import { useQuery, type UseQueryOptions } from '@tanstack/vue-query'

import getBooksFromCollection from '@/services/sheet/getBooksFromCollection'
import { useSheetStore } from '@/stores/sheet'
import { fetch } from '@/util/gapi'
import Book from '@/model/Book'

export default function useBookCollectionQuery(
  book: Ref<Book | undefined | null>,
  { enabled }: UseQueryOptions
) {
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  async function fetcher() {
    return await fetch(getBooksFromCollection(sheetId.value!, book.value!))
  }

  const bookTitle = computed(() => book.value?.titleParts?.title + ' #')

  return useQuery(['book-collection', bookTitle], fetcher, { enabled })
}
