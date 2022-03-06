import { computed } from 'vue'
import { useQuery } from 'vue-query'

import getBooks from '@/services/sheet/getBooks'
import { useAuthStore } from '@/stores/auth'
import { useSheetStore } from '@/stores/sheet'

export default function useLastAddedQuery({ enabled }) {
  const authStore = useAuthStore()
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  async function fetcher() {
    const { books } = await getBooks(sheetId.value, 1, {
      limit: 6,
      dontCount: true
    })

    return books
  }

  return useQuery('last-added', fetcher, {
    enabled,
    retry(_, error) {
      if (error.code === 401) {
        authStore.refreshToken()
      }

      return 2
    }
  })
}
