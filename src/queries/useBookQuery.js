import { computed } from 'vue'
import { useQuery } from 'vue-query'

import { useSheetStore } from '@/stores/sheet'
import getBookById from '@/services/sheet/getBookById'

export default function useBookQuery (bookId, { enabled }) {
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  async function fetcher () {
    return await getBookById(sheetId.value, bookId.value)
  }

  return useQuery(['book', bookId], fetcher, { enabled })
}
