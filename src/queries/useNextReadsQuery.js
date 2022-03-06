import { computed } from 'vue'
import { useQuery } from 'vue-query'

import getNextReads from '@/services/sheet/getNextReads'
import { useAuthStore } from '@/stores/auth'
import { useSheetStore } from '@/stores/sheet'

export default function useNextReadsQuery({ enabled }) {
  const authStore = useAuthStore()
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  async function fetcher() {
    return await getNextReads(sheetId.value)
  }

  return useQuery('next-reads', fetcher, {
    enabled,
    retry(_, error) {
      if (error.code === 401) {
        authStore.refreshToken()
      }

      return 2
    }
  })
}
