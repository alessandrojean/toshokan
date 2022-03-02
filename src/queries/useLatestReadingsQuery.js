import { computed } from 'vue'
import { useQuery } from 'vue-query'

import { useSheetStore } from '@/stores/sheet'
import getLatestReadings from '@/services/sheet/getLatestReadings'

export default function useLatestReadingsQuery({ enabled }) {
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  async function fetcher() {
    return await getLatestReadings(sheetId.value, { limit: 6 })
  }

  return useQuery('latest-readings', fetcher, { enabled })
}
