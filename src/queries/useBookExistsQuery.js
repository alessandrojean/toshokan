import { computed } from 'vue'
import { useQuery } from 'vue-query'

import { useSheetStore } from '@/stores/sheet'
import getBookByCode from '@/services/sheet/getBookByCode'

export default function useBookExistsQuery(isbn, { enabled }) {
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  async function fetcher() {
    return await getBookByCode(sheetId.value, isbn.value)
  }

  return useQuery(['book-exists', isbn], fetcher, { enabled })
}
