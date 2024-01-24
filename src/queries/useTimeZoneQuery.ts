import { type UseQueryOptions, useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'

import getTimeZone from '@/services/sheet/getTimeZone'
import { useSheetStore } from '@/stores/sheet'
import { fetch } from '@/util/gapi'

type GetTimeZoneReturn = Awaited<ReturnType<typeof getTimeZone>> | undefined
type UseTimeZoneQueryOptions<S> = UseQueryOptions<GetTimeZoneReturn, Error, S>

export default function useTimeZoneQuery<S = GetTimeZoneReturn>(options: UseTimeZoneQueryOptions<S> = {}) {
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  return useQuery({
    queryKey: ['timezone', { sheetId }],
    queryFn: async () => {
      return await fetch(getTimeZone(sheetId.value!))
    },
    initialData: {
      name: 'America/Sao_Paulo',
      offset: -3,
      offsetStr: '-03:00',
      timezoneOffset: 180,
    },
    ...options,
  })
}
