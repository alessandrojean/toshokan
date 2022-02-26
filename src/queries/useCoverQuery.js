import { computed } from 'vue'
import { useQuery } from 'vue-query'

import { findCovers } from '@/services/cover'

export default function useCoverQuery (book, { enabled } = {}) {
  const bookCode = computed(() => book.value?.code)

  async function fetcher () {
    return await findCovers(book.value)
  }

  return useQuery(['book-cover', bookCode], fetcher, { enabled })
}
