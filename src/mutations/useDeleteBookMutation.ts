import { useMutation, useQueryClient } from 'vue-query'

import { useSheetStore } from '@/stores/sheet'
import deleteBook from '@/services/sheet/deleteBook'
import { fetch } from '@/util/gapi'
import Book from '@/model/Book'

export default function useDeleteBookMutation() {
  const sheetStore = useSheetStore()
  const queryClient = useQueryClient()

  async function mutate(book: Book) {
    return await fetch(deleteBook(sheetStore.sheetId!, book))
  }

  return useMutation(mutate, {
    onSuccess(_, book) {
      queryClient.setQueryData(['book', book.id], null)

      queryClient.setQueriesData<{ books: Book[] }>('books', (oldData) => {
        return {
          ...oldData,
          books: (oldData?.books ?? []).filter(({ id }) => id !== book.id)
        }
      })
    },
    onSettled() {
      queryClient.invalidateQueries('last-added')
      queryClient.invalidateQueries('latest-readings')
      queryClient.invalidateQueries('next-reads')
      queryClient.invalidateQueries('groups')
      queryClient.invalidateQueries('books')
      queryClient.invalidateQueries('authors')
      queryClient.invalidateQueries('book-search')
      queryClient.invalidateQueries('statistics')
    }
  })
}
