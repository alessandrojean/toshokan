import { type UseQueryOptions, useQuery } from '@tanstack/vue-query'
import { type Ref, computed } from 'vue'

import type Book from '@/model/Book'
import { findCovers } from '@/services/cover'

type FindCoversReturn = Awaited<ReturnType<typeof findCovers>> | undefined
type UseCoverQueryOptions<S> = UseQueryOptions<FindCoversReturn, Error, S> &
  { book: Ref<Book> }

export default function useCoverQuery<S = FindCoversReturn>(options: UseCoverQueryOptions<S>) {
  const bookCode = computed(() => options.book.value?.code)

  return useQuery({
    queryKey: ['book-cover', bookCode],
    queryFn: async () => {
      return await findCovers(options.book.value)
    },
    ...options,
  })
}
