import { computed } from 'vue'
import { useQuery } from 'vue-query'

import { useSheetStore } from '@/stores/sheet'
import getNextReads from '@/services/sheet/getNextReads'

export default function useNextReadsQuery({ enabled }) {
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  async function fetcher() {
    return await getNextReads(sheetId.value)
  }

  return useQuery('next-reads', fetcher, { enabled })
}
