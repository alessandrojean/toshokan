import { computed } from 'vue'
import { useQuery } from 'vue-query'

import { useSheetStore } from '@/stores/sheet'
import getStores from '@/services/sheet/getStores'

export default function useStoresQuery({ enabled }) {
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  async function fetcher() {
    return await getStores(sheetId.value)
  }

  return useQuery('stores', fetcher, { enabled })
}
