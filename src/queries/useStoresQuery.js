import { computed } from 'vue'
import { useQuery } from 'vue-query'

import getStores from '@/services/sheet/getStores'
import { useAuthStore } from '@/stores/auth'
import { useSheetStore } from '@/stores/sheet'

export default function useStoresQuery({ enabled }) {
  const authStore = useAuthStore()
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  async function fetcher() {
    return await getStores(sheetId.value)
  }

  return useQuery('stores', fetcher, {
    enabled,
    retry(_, error) {
      if (error.code === 401) {
        authStore.refreshToken()
      }

      return 2
    }
  })
}
