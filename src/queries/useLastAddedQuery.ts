import { type UseQueryOptions, useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'

import getBooks from '@/services/sheet/getBooks'
import { useSheetStore } from '@/stores/sheet'
import { fetch } from '@/util/gapi'

type GetBooksReturn = Awaited<ReturnType<typeof getBooks>>['books'] | undefined
type useLastAddedQueryOptions<S> = UseQueryOptions<GetBooksReturn, Error, S>

export default function useLastAddedQuery<S = GetBooksReturn>(options: useLastAddedQueryOptions<S> = {}) {
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  return useQuery({
    queryKey: ['last-added', { sheetId }],
    queryFn: async () => {
      const promise = getBooks(sheetId.value!, 1, {
        limit: 6,
        dontCount: true,
      })

      const result = await fetch(promise)

      return result?.books
    },
    ...options,
  })
}
