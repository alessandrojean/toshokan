import { type UseQueryOptions, useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'

import getNextReads from '@/services/sheet/getNextReads'
import { useSheetStore } from '@/stores/sheet'
import { fetch } from '@/util/gapi'

export interface UseNextReadsQueryArgs {
  limit?: number
  threshold?: number
}
type GetNextReadsReturn = Awaited<ReturnType<typeof getNextReads>> | undefined
type UseNextReadsQueryOptions<S> = UseQueryOptions<GetNextReadsReturn, Error, S> & UseNextReadsQueryArgs

export default function useNextReadsQuery<S = GetNextReadsReturn>(options: UseNextReadsQueryOptions<S> = {}) {
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  return useQuery({
    queryKey: ['next-reads', {
      sheetId,
      limit: options.limit,
      threshold: options.threshold,
    }],
    queryFn: async () => {
      const books = await fetch(
        getNextReads(sheetId.value!, {
          threshold: options.threshold === Number.POSITIVE_INFINITY ? undefined : 6 * 30, /* 6 months */
        }),
      )

      return options.limit ? books?.slice(0, 6) : books
    },
    ...options,
  })
}
