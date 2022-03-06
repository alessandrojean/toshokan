import { computed, watch } from 'vue'
import { useQuery } from 'vue-query'

import getStatistics from '@/services/sheet/getStatistics'
import { useAuthStore } from '@/stores/auth'
import { useSheetStore } from '@/stores/sheet'

export default function useStatisticsQuery({ enabled }) {
  const authStore = useAuthStore()
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  async function fetcher() {
    return await getStatistics(sheetId.value)
  }

  const query = useQuery('statistics', fetcher, {
    enabled,
    retry(_, error) {
      if (error.code === 401) {
        authStore.refreshToken()
      }

      return 2
    }
  })

  watch(query.data, (newData) => {
    sheetStore.updateIsEmpty(newData?.count === 0)
  })

  return query
}
