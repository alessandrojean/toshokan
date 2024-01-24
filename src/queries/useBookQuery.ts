import { type UseQueryOptions, useQuery } from '@tanstack/vue-query'
import { type Ref, computed } from 'vue'

import type Book from '@/model/Book'
import getBookById from '@/services/sheet/getBookById'
import { useSheetStore } from '@/stores/sheet'
import { fetch } from '@/util/gapi'

type GetBookByIdReturn = Book | null | undefined
type UseBookQueryOptions<S> = UseQueryOptions<GetBookByIdReturn, Error, S> &
  { bookId: Ref<string> }

export default function useBookQuery<S = GetBookByIdReturn>(options: UseBookQueryOptions<S>) {
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  return useQuery({
    queryKey: ['book', { bookId: options.bookId, sheetId }],
    queryFn: async () => {
      return await fetch(getBookById(sheetId.value!, options.bookId.value))
    },
    ...options,
  })
}
