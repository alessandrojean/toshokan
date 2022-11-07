import { computed } from 'vue'
import { useQuery, type UseQueryOptions } from 'vue-query'

import getTimeZone from '@/services/sheet/getTimeZone'
import { useSheetStore } from '@/stores/sheet'
import { fetch } from '@/util/gapi'

export default function useTimeZoneQuery({ enabled }: UseQueryOptions) {
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  async function fetcher() {
    return await fetch(getTimeZone(sheetId.value!))
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
