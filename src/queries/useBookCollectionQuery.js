import { computed } from 'vue'
import { useQuery } from 'vue-query'

import getBooksFromCollection from '@/services/sheet/getBooksFromCollection'
import { useAuthStore } from '@/stores/auth'
import { useSheetStore } from '@/stores/sheet'

export default function useBookCollectionQuery(book, { enabled }) {
  const authStore = useAuthStore()
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  async function fetcher() {
    return await getBooksFromCollection(sheetId.value, book.value)
  }

  const bookTitle = computed(() => book.value?.titleParts?.title + ' #')

  return useQuery(['book-collection', bookTitle], fetcher, {
    enabled,
    retry(_, error) {
      if (error.code === 401) {
        authStore.refreshToken()
      }

      return 2
    }
  })
}
