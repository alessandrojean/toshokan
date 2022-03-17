import { computed } from 'vue'
import { useQuery } from 'vue-query'

import getPublishers from '@/services/sheet/getPublishers'
import { useSheetStore } from '@/stores/sheet'
import { fetch } from '@/util/gapi'

export default function usePublishersQuery({ enabled }) {
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  async function fetcher() {
    return await fetch(getPublishers(sheetId.value))
  }

  return useQuery('publishers', fetcher, { enabled })
}
