import { computed } from 'vue'
import { useQuery, type UseQueryOptions } from '@tanstack/vue-query'

import getVersion from '@/services/sheet/getVersion'
import { useSheetStore } from '@/stores/sheet'
import { fetch } from '@/util/gapi'

export default function useSheetVersionQuery({ enabled }: UseQueryOptions) {
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  async function fetcher() {
    return await fetch(getVersion(sheetId.value!))
  }

  return useQuery(['sheet-version'], fetcher, {
    enabled,
    initialData: 0
  })
}
