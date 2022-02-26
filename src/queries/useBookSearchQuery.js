import { computed } from 'vue'
import { useQuery } from 'vue-query'

import { useSheetStore } from '@/stores/sheet'
import searchBooks from '@/services/sheet/searchBooks'

export default function useBookSearchQuery (
  { query, sortBy, sortDirection, page },
  { enabled, keepPreviousData }
) {
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  async function fetcher () {
    return await searchBooks({
      sheetId: sheetId.value,
      searchTerm: query.value,
      sort: {
        sortBy: sortBy.value,
        sortDirection: sortDirection.value
      },
      page: page.value
    })
  }

  return useQuery(
    [
      'book-search',
      { query, sortBy, sortDirection, page }
    ],
    fetcher,
    { enabled, keepPreviousData }
  )
}
