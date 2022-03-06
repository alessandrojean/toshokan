import { computed } from 'vue'
import { useQuery } from 'vue-query'

import getBookById from '@/services/sheet/getBookById'
import { useAuthStore } from '@/stores/auth'
import { useSheetStore } from '@/stores/sheet'

export default function useBookQuery(bookId, { enabled }) {
  const authStore = useAuthStore()
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  async function fetcher() {
    return await getBookById(sheetId.value, bookId.value)
  }

  return useQuery(['book', bookId], fetcher, {
    enabled,
    retry(_, error) {
      if (error.code === 401) {
        authStore.refreshToken()
      }

      return 2
    }
  })
}
