import { type UseQueryOptions, useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'

import getLatestReadings from '@/services/sheet/getLatestReadings'
import { useSheetStore } from '@/stores/sheet'
import { fetch } from '@/util/gapi'

type GetLatestReadingsReturn = Awaited<ReturnType<typeof getLatestReadings>> | undefined
type UseLatestReadingsQueryOptions<S> = UseQueryOptions<GetLatestReadingsReturn, Error, S>

export default function useLatestReadingsQuery<S = GetLatestReadingsReturn>(options: UseLatestReadingsQueryOptions<S> = {}) {
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  return useQuery({
    queryKey: ['latest-readings', { sheetId }],
    queryFn: async () => {
      return await fetch(getLatestReadings(sheetId.value!, { limit: 6 }))
    },
    ...options,
  })
}
