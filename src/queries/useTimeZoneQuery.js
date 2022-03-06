import { computed } from 'vue'
import { useQuery } from 'vue-query'

import getTimeZone from '@/services/sheet/getTimeZone'
import { useAuthStore } from '@/stores/auth'
import { useSheetStore } from '@/stores/sheet'

export default function useTimeZoneQuery({ enabled }) {
  const authStore = useAuthStore()
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  async function fetcher() {
    return await getTimeZone(sheetId.value)
  }

  return useQuery('timezone', fetcher, {
    enabled,
    initialData: {
      name: 'America/Sao_Paulo',
      offset: -3,
      offsetStr: '-03:00',
      timezoneOffset: 180
    },
    retry(_, error) {
      if (error.code === 401) {
        authStore.refreshToken()
      }

      return 2
    }
  })
}
