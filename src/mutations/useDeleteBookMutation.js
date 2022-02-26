import { useMutation, useQueryClient } from 'vue-query'

import { useSheetStore } from '@/stores/sheet'
import deleteBook from '@/services/sheet/deleteBook'

export default function useDeleteBookMutation () {
  const sheetStore = useSheetStore()
  const queryClient = useQueryClient()

  return useMutation(book => deleteBook(sheetStore.sheetId, book), {
    onSuccess (_, book) {
      queryClient.setQueryData(['book', book.id], null)

      queryClient.setQueriesData('books', oldData => {
        return {
          ...oldData,
          books: oldData.books.filter(({ id }) => id !== book.id)
        }
      })
    },
    onSettled () {
      queryClient.invalidateQueries('last-added')
      queryClient.invalidateQueries('latest-readings')
      queryClient.invalidateQueries('next-reads')
      queryClient.invalidateQueries('groups')
      queryClient.invalidateQueries('books')
      queryClient.invalidateQueries('book-search')
      queryClient.invalidateQueries('statistics')
    }
  })
}
