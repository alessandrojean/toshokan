import { computed } from 'vue'
import { useQuery } from 'vue-query'

import { useSheetStore } from '@/stores/sheet'
import getBooks from '@/services/sheet/getBooks'

export default function useLastAddedQuery ({ enabled }) {
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  async function fetcher () {
    const { books } = await getBooks(sheetId.value, 1, {
      limit: 6,
      dontCount: true
    })

    return books
  }

  return useQuery('last-added', fetcher, { enabled })
}
