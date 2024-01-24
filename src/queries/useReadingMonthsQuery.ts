import { type UseQueryOptions, useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'

import getReadingMonths from '@/services/sheet/getReadingMonths'
import { useSheetStore } from '@/stores/sheet'
import { fetch } from '@/util/gapi'

type GetReadingMonthsReturn = Awaited<ReturnType<typeof getReadingMonths>> | undefined
type UseReadingMonthsQueryOptions<S> = UseQueryOptions<GetReadingMonthsReturn, Error, S>

export default function useReadingMonthsQuery<S = GetReadingMonthsReturn>(options: UseReadingMonthsQueryOptions<S> = {}) {
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  return useQuery({
    queryKey: ['reading-months', { sheetId }],
    queryFn: async () => {
      return await fetch(getReadingMonths(sheetId.value!))
    },
    ...options,
  })
}
