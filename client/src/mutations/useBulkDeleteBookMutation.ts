import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'

import type Book from '@/model/Book'
import bulkDeleteBooks from '@/services/sheet/bulkDeleteBooks'
import { useSheetStore } from '@/stores/sheet'
import { fetch } from '@/util/gapi'

export default function useBulkDeleteBookMutation() {
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)
  const queryClient = useQueryClient()

  async function mutate(books: Book[]) {
    return await fetch(bulkDeleteBooks(sheetId.value!, books))
  }

  return useMutation({
    mutationFn: mutate,
    onSuccess(_, books) {
      books.forEach((book) => {
        queryClient.setQueryData(['book', { bookId: book.id, sheetId }], null)
      })

      queryClient.setQueriesData<{ books: Book[] }>(
        { queryKey: ['books', { sheetId }] },
        (oldData) => {
          return {
            ...oldData,
            books: (oldData?.books ?? []).filter((oldBook) => {
              return books.find(({ id }) => id === oldBook.id) === undefined
            }),
          }
        },
      )
    },
    onSettled() {
      queryClient.invalidateQueries({ queryKey: ['last-added'] })
      queryClient.invalidateQueries({ queryKey: ['latest-readings'] })
      queryClient.invalidateQueries({ queryKey: ['next-reads'] })
      queryClient.invalidateQueries({ queryKey: ['groups'] })
      queryClient.invalidateQueries({ queryKey: ['authors'] })
      queryClient.invalidateQueries({ queryKey: ['books'] })
      queryClient.invalidateQueries({ queryKey: ['book-search'] })
      queryClient.invalidateQueries({ queryKey: ['statistics'] })
      queryClient.invalidateQueries({ queryKey: ['reading-months'] })
    },
  })
}
