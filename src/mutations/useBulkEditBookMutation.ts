import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'

import type Book from '@/model/Book'
import bulkUpdateBooks from '@/services/sheet/bulkUpdateBooks'
import { useSheetStore } from '@/stores/sheet'
import { fetch } from '@/util/gapi'

export default function useBulkEditBookMutation() {
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)
  const queryClient = useQueryClient()

  async function mutate(books: Book[]) {
    return await fetch(bulkUpdateBooks(sheetId.value!, books))
  }

  return useMutation({
    mutationFn: mutate,
    onSuccess(_, books) {
      books.forEach((book) => {
        queryClient.setQueryData(['book', { bookId: book.id, sheetId }], book)
      })

      queryClient.setQueriesData<{ books: Book[] }>(
        { queryKey: ['books', { sheetId }] },
        (oldData) => {
          return {
            ...oldData,
            books: (oldData?.books ?? []).map((oldBook) => {
              return books.find(({ id }) => id === oldBook.id) || oldBook
            }),
          }
        },
      )
    },
    onSettled() {
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
