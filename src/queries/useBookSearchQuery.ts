import { computed, type Ref } from 'vue'
import { useQuery, type UseQueryOptions } from 'vue-query'

import { PropertyToColumn } from '@/model/Book'
import searchBooks from '@/services/sheet/searchBooks'
import { useSheetStore } from '@/stores/sheet'
import { fetch } from '@/util/gapi'

type UseBookSearchQueryArgs = {
  query: Ref<string>
  sortBy: Ref<string>
  sortDirection: Ref<'asc' | 'desc'>
  page: Ref<number>
}

export default function useBookSearchQuery(
  { query, sortBy, sortDirection, page }: UseBookSearchQueryArgs,
  { enabled, keepPreviousData }: UseQueryOptions
) {
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  async function fetcher() {
    const promise = searchBooks({
      sheetId: sheetId.value!,
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
