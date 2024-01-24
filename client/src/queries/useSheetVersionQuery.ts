import { type UseQueryOptions, useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'

import getVersion from '@/services/sheet/getVersion'
import { useSheetStore } from '@/stores/sheet'
import { fetch } from '@/util/gapi'

type GetVersionReturn = Awaited<ReturnType<typeof getVersion>> | undefined
type UseSheetVersionQueryOptions<S> = UseQueryOptions<GetVersionReturn, Error, S>

export default function useSheetVersionQuery<S = GetVersionReturn>(options: UseSheetVersionQueryOptions<S> = {}) {
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  return useQuery({
    queryKey: ['sheet-version', { sheetId }],
    queryFn: async () => {
      return await fetch(getVersion(sheetId.value!))
    },
    initialData: 0,
    ...options,
  })
}
