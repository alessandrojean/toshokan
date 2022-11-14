import { computed } from 'vue'
import { useQuery, type UseQueryOptions } from '@tanstack/vue-query'

import { useSheetStore } from '@/stores/sheet'
import { fetch } from '@/util/gapi'
import getReadingMonths from '@/services/sheet/getReadingMonths'

export default function useReadingMonthsQuery({ enabled }: UseQueryOptions) {
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  async function fetcher() {
    return await fetch(getReadingMonths(sheetId.value!))
  }

  return useQuery(['reading-months', { sheetId }], fetcher, { enabled })
}
