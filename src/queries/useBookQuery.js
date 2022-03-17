import { computed } from 'vue'
import { useQuery } from 'vue-query'

import getBookById from '@/services/sheet/getBookById'
import { useSheetStore } from '@/stores/sheet'
import { fetch } from '@/util/gapi'

export default function useBookQuery(bookId, { enabled }) {
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  async function fetcher() {
    return await fetch(getBookById(sheetId.value, bookId.value))
  }

  return useQuery(['book', bookId], fetcher, { enabled })
}
