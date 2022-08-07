import { useMutation, useQueryClient } from 'vue-query'

import { useSheetStore } from '@/stores/sheet'
import bulkDeleteBooks from '@/services/sheet/bulkDeleteBooks'
import { fetch } from '@/util/gapi'

export default function useBulkDeleteBookMutation() {
  const sheetStore = useSheetStore()
  const queryClient = useQueryClient()

  async function mutate(books) {
    return await fetch(bulkDeleteBooks(sheetStore.sheetId, books))
  }

  return useMutation(mutate, {
    onSuccess(_, books) {
      books.forEach((book) => {
        queryClient.setQueryData(['book', book.id], null)
      })

      queryClient.setQueriesData('books', (oldData) => {
        return {
          ...oldData,
          books: oldData.books.filter((oldBook) => {
            return books.find(({ id }) => id === oldBook.id) === undefined
          })
        }
      })
    },
    onSettled() {
      queryClient.invalidateQueries('last-added')
      queryClient.invalidateQueries('latest-readings')
      queryClient.invalidateQueries('next-reads')
      queryClient.invalidateQueries('groups')
      queryClient.invalidateQueries('authors')
      queryClient.invalidateQueries('books')
      queryClient.invalidateQueries('book-search')
      queryClient.invalidateQueries('statistics')
    }
  })
}
