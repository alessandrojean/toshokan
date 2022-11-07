import type { Ref } from 'vue'
import { useQuery, type UseQueryOptions } from 'vue-query'

import lookupSearch from '@/services/lookup'

export default function useIsbnSearchQuery(
  isbn: Ref<string>,
  { enabled }: UseQueryOptions
) {
  async function fetcher() {
    return await lookupSearch(isbn.value)
  }

  return useQuery(['isbn-search', isbn], fetcher, { enabled })
}
