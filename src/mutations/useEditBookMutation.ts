import { useMutation, useQueryClient } from '@tanstack/vue-query'

import { useSheetStore } from '@/stores/sheet'
import updateBook from '@/services/sheet/updateBook'
import { fetch } from '@/util/gapi'
import Book from '@/model/Book'

export default function useEditBookMutation() {
  const sheetStore = useSheetStore()
  const queryClient = useQueryClient()

  async function mutate(book: Book) {
    return await fetch(updateBook(sheetStore.sheetId!, book))
  }

  return useMutation(mutate, {
    onSuccess(_, book) {
      queryClient.setQueriesData<{ books: Book[] }>(['books'], (oldData) => {
        return {
          ...oldData,
          books: (oldData?.books ?? []).map((oldBook) => {
            return oldBook.id === book.id ? book : oldBook
          })
        }
      })
      queryClient.setQueryData(['book', book.id], book)
    },
    onSettled() {
      queryClient.invalidateQueries(['last-added'])
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
