import { computed, type Ref } from 'vue'
import { useQuery, type UseQueryOptions } from 'vue-query'

import { findCovers } from '@/services/cover'
import Book from '@/model/Book'

export default function useCoverQuery(
  book: Ref<Book>,
  { enabled }: UseQueryOptions = {}
) {
  const bookCode = computed(() => book.value?.code)

  async function fetcher() {
    return await findCovers(book.value)
  }

  return useQuery(['book-cover', bookCode], fetcher, { enabled })
}
