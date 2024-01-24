import { type UseQueryOptions, useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'

import getPublishers from '@/services/sheet/getPublishers'
import { useSheetStore } from '@/stores/sheet'
import { fetch } from '@/util/gapi'

type GetPublishersReturn = Awaited<ReturnType<typeof getPublishers>> | undefined
type UsePublishersQueryOptions<S> = UseQueryOptions<GetPublishersReturn, Error, S>

export default function usePublishersQuery<S = GetPublishersReturn>(options: UsePublishersQueryOptions<S> = {}) {
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  return useQuery({
    queryKey: ['publishers', { sheetId }],
    queryFn: async () => {
      return await fetch(getPublishers(sheetId.value!))
    },
    ...options,
  })
}
