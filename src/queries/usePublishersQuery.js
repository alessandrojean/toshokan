import { computed } from 'vue'
import { useQuery } from 'vue-query'

import { useSheetStore } from '@/stores/sheet'
import getPublishers from '@/services/sheet/getPublishers'

export default function usePublishersQuery ({ enabled }) {
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  async function fetcher () {
    return await getPublishers(sheetId.value)
  }

  return useQuery('publishers', fetcher, { enabled })
}
