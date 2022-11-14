import { computed, watch } from 'vue'
import { useQuery, type UseQueryOptions } from '@tanstack/vue-query'

import getStatistics from '@/services/sheet/getStatistics'
import { useSheetStore } from '@/stores/sheet'
import { fetch } from '@/util/gapi'

export default function useStatisticsQuery({ enabled }: UseQueryOptions) {
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  async function fetcher() {
    return await fetch(getStatistics(sheetId.value!))
  }

  const query = useQuery(['statistics', { sheetId }], fetcher, { enabled })

  watch(query.data, (newData) => {
    sheetStore.updateIsEmpty(newData?.count === 0)
  })

  return query
}
