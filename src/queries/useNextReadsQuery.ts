import { computed } from 'vue'
import { useQuery, type UseQueryOptions } from '@tanstack/vue-query'

import getNextReads from '@/services/sheet/getNextReads'
import { useSheetStore } from '@/stores/sheet'
import { fetch } from '@/util/gapi'

export interface useNextReadsQueryArgs {
  limit?: number
  threshold?: number
}

export default function useNextReadsQuery(
  { limit, threshold }: useNextReadsQueryArgs,
  { enabled }: UseQueryOptions
) {
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  async function fetcher() {
    const books = await fetch(
      getNextReads(sheetId.value!, {
        threshold: threshold === Infinity ? undefined : 6 * 30 /* 6 months */
      })
    )

    return limit ? books?.slice(0, 6) : books
  }

  return useQuery(['next-reads', { sheetId, limit, threshold }], fetcher, {
    enabled
  })
}
