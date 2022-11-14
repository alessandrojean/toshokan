import { useMutation, useQueryClient } from '@tanstack/vue-query'

import { useSheetStore } from '@/stores/sheet'
import bulkUpdateBooks from '@/services/sheet/bulkUpdateBooks'
import { fetch } from '@/util/gapi'
import Book from '@/model/Book'

export default function useBulkEditBookMutation() {
  const sheetStore = useSheetStore()
  const queryClient = useQueryClient()

  async function mutate(books: Book[]) {
    return await fetch(bulkUpdateBooks(sheetStore.sheetId!, books))
  }

  return useMutation(mutate, {
    onSuccess(_, books) {
      books.forEach((book) => {
        queryClient.setQueryData(['book', book.id], book)
      })

      queryClient.setQueriesData<{ books: Book[] }>(['books'], (oldData) => {
        return {
          ...oldData,
          books: (oldData?.books ?? []).map((oldBook) => {
            return books.find(({ id }) => id === oldBook.id) || oldBook
          })
        }
      })
    },
    onSettled() {
      queryClient.invalidateQueries(['latest-readings'])
      queryClient.invalidateQueries(['next-reads'])
      queryClient.invalidateQueries(['groups'])
      queryClient.invalidateQueries(['books'])
      queryClient.invalidateQueries(['authors'])
      queryClient.invalidateQueries(['book-search'])
      queryClient.invalidateQueries(['statistics'])
      queryClient.invalidateQueries(['reading-months'])
    }
  })
}
