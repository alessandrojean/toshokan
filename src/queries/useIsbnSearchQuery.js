import { useQuery } from 'vue-query'

import lookupSearch from '@/services/lookup'

export default function useIsbnSearchQuery(isbn, { enabled }) {
  async function fetcher() {
    return await lookupSearch(isbn.value)
  }

  return useQuery(['isbn-search', isbn], fetcher, { enabled })
}
