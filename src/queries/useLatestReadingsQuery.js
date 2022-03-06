import { computed } from 'vue'
import { useQuery } from 'vue-query'

import getLatestReadings from '@/services/sheet/getLatestReadings'
import { useAuthStore } from '@/stores/auth'
import { useSheetStore } from '@/stores/sheet'

export default function useLatestReadingsQuery({ enabled }) {
  const authStore = useAuthStore()
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  async function fetcher() {
    return await getLatestReadings(sheetId.value, { limit: 6 })
  }

  return useQuery('latest-readings', fetcher, {
    enabled,
    retry(_, error) {
      if (error.code === 401) {
        authStore.refreshToken()
      }

      return 2
    }
  })
}
