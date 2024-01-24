import { type UseQueryOptions, useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'

import getStores from '@/services/sheet/getStores'
import { useSheetStore } from '@/stores/sheet'
import { fetch } from '@/util/gapi'

type GetStoresReturn = Awaited<ReturnType<typeof getStores>> | undefined
type UseStoresQueryOptions<S> = UseQueryOptions<GetStoresReturn, Error, S>

export default function useStoresQuery<S = GetStoresReturn>(options: UseStoresQueryOptions<S> = {}) {
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  return useQuery({
    queryKey: ['stores', { sheetId }],
    queryFn: async () => {
      return await fetch(getStores(sheetId.value!))
    },
    ...options,
  })
}
