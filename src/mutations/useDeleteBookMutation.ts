import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'

import type Book from '@/model/Book'
import deleteBook from '@/services/sheet/deleteBook'
import { useSheetStore } from '@/stores/sheet'
import { fetch } from '@/util/gapi'

export default function useDeleteBookMutation() {
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)
  const queryClient = useQueryClient()

  async function mutate(book: Book) {
    return await fetch(deleteBook(sheetId.value!, book))
  }

  return useMutation({
    mutationFn: mutate,
    onSuccess(_, book) {
      queryClient.setQueryData(['book', { bookId: book.id, sheetId }], null)

      queryClient.setQueriesData<{ books: Book[] }>(
        { queryKey: ['books', { sheetId }] },
        (oldData) => {
          return {
            ...oldData,
            books: (oldData?.books ?? []).filter(({ id }) => id !== book.id),
          }
        },
      )
    },
    onSettled() {
      queryClient.invalidateQueries({ queryKey: ['last-added'] })
      queryClient.invalidateQueries({ queryKey: ['latest-readings'] })
      queryClient.invalidateQueries({ queryKey: ['next-reads'] })
      queryClient.invalidateQueries({ queryKey: ['groups'] })
      queryClient.invalidateQueries({ queryKey: ['books'] })
      queryClient.invalidateQueries({ queryKey: ['authors'] })
      queryClient.invalidateQueries({ queryKey: ['book-search'] })
      queryClient.invalidateQueries({ queryKey: ['statistics'] })
      queryClient.invalidateQueries({ queryKey: ['reading-months'] })
    },
  })
}
