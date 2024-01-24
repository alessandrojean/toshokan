import { type UseQueryOptions, useQuery } from '@tanstack/vue-query'
import { type Ref, computed } from 'vue'

import type Book from '@/model/Book'
import getBooksFromCollection from '@/services/sheet/getBooksFromCollection'
import { useSheetStore } from '@/stores/sheet'
import { fetch } from '@/util/gapi'

type GetBooksReturn = Book[] | undefined | null
type UseBookCollectionQueryOptions<S> = UseQueryOptions<GetBooksReturn, Error, S>
  & { book: Ref<Book | undefined | null> }

export default function useBookCollectionQuery<S = GetBooksReturn>(options: UseBookCollectionQueryOptions<S>) {
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  const bookTitle = computed(() => `${options.book.value?.titleParts?.title} #`)

  return useQuery({
    queryKey: ['book-collection', { bookTitle, sheetId }],
    queryFn: async () => {
      if (!options.book.value) {
        return null
      }

      return await fetch(getBooksFromCollection(sheetId.value!, options.book.value))
    },
    ...options,
  })
}
