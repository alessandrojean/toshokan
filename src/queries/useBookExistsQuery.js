import { computed } from 'vue'
import { useQuery } from 'vue-query'

import getBookByCode from '@/services/sheet/getBookByCode'
import { useAuthStore } from '@/stores/auth'
import { useSheetStore } from '@/stores/sheet'

export default function useBookExistsQuery(isbn, { enabled }) {
  const authStore = useAuthStore()
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  async function fetcher() {
    return await getBookByCode(sheetId.value, isbn.value)
  }

  return useQuery(['book-exists', isbn], fetcher, {
    enabled,
    retry(_, error) {
      if (error.code === 401) {
        authStore.refreshToken()
      }

      return 2
    }
  })
}
