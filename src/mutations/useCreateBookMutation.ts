import { useMutation, useQueryClient } from '@tanstack/vue-query'

import { useSheetStore } from '@/stores/sheet'
import insertBook from '@/services/sheet/insertBook'
import { fetch } from '@/util/gapi'
import Book from '@/model/Book'

export default function useCreateBookMutation() {
  const sheetStore = useSheetStore()
  const queryClient = useQueryClient()

  async function mutate(book: Book) {
    return await fetch(insertBook(sheetStore.sheetId!, book))
  }

  return useMutation(mutate, {
    onSuccess(_, book) {
      queryClient.setQueryData(['book', book.id], book)
    },
    onSettled() {
      queryClient.invalidateQueries(['last-added'])
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
