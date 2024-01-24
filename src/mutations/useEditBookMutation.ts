import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'

import type Book from '@/model/Book'
import updateBook from '@/services/sheet/updateBook'
import { useSheetStore } from '@/stores/sheet'
import { fetch } from '@/util/gapi'

export default function useEditBookMutation() {
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)
  const queryClient = useQueryClient()

  async function mutate(book: Book) {
    return await fetch(updateBook(sheetId.value!, book))
  }

  return useMutation({
    mutationFn: mutate,
    onSuccess(_, book) {
      queryClient.setQueriesData<{ books: Book[] }>(
        { queryKey: ['books', { sheetId }] },
        (oldData) => {
          return {
            ...oldData,
            books: (oldData?.books ?? []).map((oldBook) => {
              return oldBook.id === book.id ? book : oldBook
            }),
          }
        },
      )
      queryClient.setQueryData(['book', { bookId: book.id, sheetId }], book)
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
