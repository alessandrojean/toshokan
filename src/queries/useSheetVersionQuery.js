import { computed } from 'vue'
import { useQuery } from 'vue-query'

import getVersion from '@/services/sheet/getVersion'
import { useSheetStore } from '@/stores/sheet'
import { fetch } from '@/util/gapi'

export default function useSheetVersionQuery({ enabled }) {
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  async function fetcher() {
    return await fetch(getVersion(sheetId.value))
  }

  return useQuery('sheet-version', fetcher, {
    enabled,
    initialData: 0
  })
}
