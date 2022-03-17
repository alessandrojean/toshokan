import { computed } from 'vue'
import { useQuery } from 'vue-query'

import getBookByCode from '@/services/sheet/getBookByCode'
import { useSheetStore } from '@/stores/sheet'
import { fetch } from '@/util/gapi'

export default function useBookExistsQuery(isbn, { enabled }) {
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  async function fetcher() {
    return await fetch(getBookByCode(sheetId.value, isbn.value))
  }

  return useQuery(['book-exists', isbn], fetcher, { enabled })
}
