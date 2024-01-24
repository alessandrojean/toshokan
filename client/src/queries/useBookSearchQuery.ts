import { type UseQueryOptions, useQuery } from '@tanstack/vue-query'
import { type Ref, computed } from 'vue'

import { PropertyToColumn } from '@/model/Book'
import searchBooks from '@/services/sheet/searchBooks'
import { useSheetStore } from '@/stores/sheet'
import type { Sort } from '@/types'
import { fetch } from '@/util/gapi'

type SearchBooksReturn = Awaited<ReturnType<typeof searchBooks>> | undefined
type UseBooksSearchQueryOptions<S> = UseQueryOptions<SearchBooksReturn, Error, S> & {
  query: Ref<string>
  sortBy: Ref<string>
  sortDirection: Ref<Sort>
  page: Ref<number>
}

export default function useBookSearchQuery<S = SearchBooksReturn>(options: UseBooksSearchQueryOptions<S>) {
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  return useQuery({
    queryKey: ['book-search', {
      query: options.query,
      sortBy: options.sortBy,
      sortDirection: options.sortDirection,
      page: options.page,
      sheetId,
    }],
    queryFn: async () => {
      const promise = searchBooks({
        sheetId: sheetId.value!,
        searchTerm: options.query.value,
        sort: {
          sortBy: PropertyToColumn[options.sortBy.value],
          sortDirection: options.sortDirection.value,
        },
        page: options.page.value,
      })

      return await fetch(promise)
    },
    ...options,
  })
}
