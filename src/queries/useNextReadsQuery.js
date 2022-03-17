import { computed } from 'vue'
import { useQuery } from 'vue-query'

import getNextReads from '@/services/sheet/getNextReads'
import { useSheetStore } from '@/stores/sheet'
import { fetch } from '@/util/gapi'

export default function useNextReadsQuery({ enabled }) {
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  async function fetcher() {
    return await fetch(getNextReads(sheetId.value))
  }

  return useQuery('next-reads', fetcher, { enabled })
}
