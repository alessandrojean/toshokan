import { type UseQueryOptions, useQuery } from '@tanstack/vue-query'
import { type Ref, computed } from 'vue'

import type Book from '@/model/Book'
import getBookByCode from '@/services/sheet/getBookByCode'
import { useSheetStore } from '@/stores/sheet'
import { fetch } from '@/util/gapi'

type BookByCodeReturn = Book[] | null | undefined
type UseBookExistsQueryOptions<S> = UseQueryOptions<BookByCodeReturn, Error, S> &
  { isbn: Ref<string> }

export default function useBookExistsQuery<S = BookByCodeReturn>(options: UseBookExistsQueryOptions<S>) {
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  return useQuery({
    queryKey: ['book-exists', { isbn: options.isbn, sheetId }],
    queryFn: async () => {
      return await fetch(getBookByCode(sheetId.value!, options.isbn.value))
    },
    ...options,
  })
}
