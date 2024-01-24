import { type UseQueryOptions, useQuery } from '@tanstack/vue-query'
import { computed, watch } from 'vue'

import getStatistics from '@/services/sheet/getStatistics'
import { useSheetStore } from '@/stores/sheet'
import { fetch } from '@/util/gapi'

type GetStatisticsReturn = Awaited<ReturnType<typeof getStatistics>> | undefined
type UseStatisticsQueryOptions<S> = UseQueryOptions<GetStatisticsReturn, Error, S>

export default function useStatisticsQuery<S = GetStatisticsReturn>(options: UseStatisticsQueryOptions<S> = {}) {
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  const query = useQuery({
    queryKey: ['statistics', { sheetId }],
    queryFn: async () => {
      return await fetch(getStatistics(sheetId.value!))
    },
    ...options,
  })

  watch(query.data, (newData) => {
    sheetStore.updateIsEmpty(newData?.count === 0)
  })

  return query
}
