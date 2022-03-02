import { computed } from 'vue'
import { useQuery } from 'vue-query'

import { useSheetStore } from '@/stores/sheet'
import getTimeZone from '@/services/sheet/getTimeZone'

export default function useTimeZoneQuery({ enabled }) {
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
    }
  })
}
