import { computed, watch } from 'vue'
import { useQuery } from 'vue-query'

import { useSheetStore } from '@/stores/sheet'
import getStatistics from '@/services/sheet/getStatistics'

export default function useStatisticsQuery({ enabled }) {
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  async function fetcher() {
    return await getStatistics(sheetId.value)
  }

  const query = useQuery('statistics', fetcher, { enabled })

  watch(query.data, (newData) => {
    sheetStore.updateIsEmpty(newData?.count === 0)
  })

  return query
}
