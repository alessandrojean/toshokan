import { computed } from 'vue'
import { useQuery } from 'vue-query'

import { PropertyToColumn } from '@/model/Book'
import searchBooks from '@/services/sheet/searchBooks'
import { useSheetStore } from '@/stores/sheet'
import { fetch } from '@/util/gapi'

export default function useBookSearchQuery(
  { query, sortBy, sortDirection, page },
  { enabled, keepPreviousData }
) {
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  async function fetcher() {
    const promise = searchBooks({
      sheetId: sheetId.value,
      searchTerm: query.value,
      sort: {
        sortBy: PropertyToColumn[sortBy.value],
        sortDirection: sortDirection.value
      },
      page: page.value
    })

    return await fetch(promise)
  }

  return useQuery(
    ['book-search', { query, sortBy, sortDirection, page }],
    fetcher,
    { enabled, keepPreviousData }
  )
}
