import { computed } from 'vue'
import { useQuery } from 'vue-query'

import { PropertyToColumn } from '@/model/Book'
import searchBooks from '@/services/sheet/searchBooks'
import { useAuthStore } from '@/stores/auth'
import { useSheetStore } from '@/stores/sheet'

export default function useBookSearchQuery(
  { query, sortBy, sortDirection, page },
  { enabled, keepPreviousData }
) {
  const authStore = useAuthStore()
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  async function fetcher() {
    return await searchBooks({
      sheetId: sheetId.value,
      searchTerm: query.value,
      sort: {
        sortBy: PropertyToColumn[sortBy.value],
        sortDirection: sortDirection.value
      },
      page: page.value
    })
  }

  return useQuery(
    ['book-search', { query, sortBy, sortDirection, page }],
    fetcher,
    {
      enabled,
      keepPreviousData,
      retry(_, error) {
        if (error.code === 401) {
          authStore.refreshToken()
        }

        return 2
      }
    }
  )
}
