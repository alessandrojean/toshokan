import { type UseQueryOptions, useQuery } from '@tanstack/vue-query'
import type { Ref } from 'vue'

import lookupSearch from '@/services/lookup'

type LookupSearchReturn = Awaited<ReturnType<typeof lookupSearch>> | undefined
type UseIsbnSearchQueryOptions<S> = UseQueryOptions<LookupSearchReturn, Error, S> &
  { isbn: Ref<string> }

export default function useIsbnSearchQuery<S = LookupSearchReturn>(options: UseIsbnSearchQueryOptions<S>) {
  return useQuery({
    queryKey: ['isbn-search', options.isbn],
    queryFn: async () => {
      return await lookupSearch(options.isbn.value)
    },
    ...options,
  })
}
