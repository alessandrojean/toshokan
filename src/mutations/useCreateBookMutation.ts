import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'

import type Book from '@/model/Book'
import insertBook from '@/services/sheet/insertBook'
import { useSheetStore } from '@/stores/sheet'
import { fetch } from '@/util/gapi'

export default function useCreateBookMutation() {
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)
  const queryClient = useQueryClient()

  async function mutate(book: Book) {
    return await fetch(insertBook(sheetId.value!, book))
  }

  return useMutation({
    mutationFn: mutate,
    onSuccess(_, book) {
      queryClient.setQueryData(['book', { bookId: book.id, sheetId }], book)
    },
    onSettled() {
      queryClient.invalidateQueries({ queryKey: ['last-added'] })
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
