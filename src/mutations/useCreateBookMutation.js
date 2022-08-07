import { useMutation, useQueryClient } from 'vue-query'

import { useCollectionStore } from '@/stores/collection'
import { useSheetStore } from '@/stores/sheet'
import insertBook from '@/services/sheet/insertBook'
import { fetch } from '@/util/gapi'

export default function useCreateBookMutation() {
  const collectionStore = useCollectionStore()
  const sheetStore = useSheetStore()
  const queryClient = useQueryClient()

  async function mutate(book) {
    return await fetch(insertBook(sheetStore.sheetId, book))
  }

  return useMutation(mutate, {
    onSuccess(_, book) {
      const groups = collectionStore.filters.groups

      if (!groups.includes(book.group) && groups.length > 0) {
        collectionStore.updateGroups({
          selected: groups.concat(book.group)
        })
      }

      queryClient.setQueryData(['book', book.id], book)
    },
    onSettled() {
      queryClient.invalidateQueries('last-added')
      queryClient.invalidateQueries('next-reads')
      queryClient.invalidateQueries('groups')
      queryClient.invalidateQueries('books')
      queryClient.invalidateQueries('authors')
      queryClient.invalidateQueries('book-search')
      queryClient.invalidateQueries('statistics')
    }
  })
}
