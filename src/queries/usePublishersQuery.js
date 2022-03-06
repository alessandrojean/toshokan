import { computed } from 'vue'
import { useQuery } from 'vue-query'

import getPublishers from '@/services/sheet/getPublishers'
import { useAuthStore } from '@/stores/auth'
import { useSheetStore } from '@/stores/sheet'

export default function usePublishersQuery({ enabled }) {
  const authStore = useAuthStore()
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  async function fetcher() {
    return await getPublishers(sheetId.value)
  }

  return useQuery('publishers', fetcher, {
    enabled,
    retry(_, error) {
      if (error.code === 401) {
        authStore.refreshToken()
      }

      return 2
    }
  })
}
