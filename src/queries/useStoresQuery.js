import { computed } from 'vue'
import { useQuery } from 'vue-query'

import getStores from '@/services/sheet/getStores'
import { useSheetStore } from '@/stores/sheet'
import { fetch } from '@/util/gapi'

export default function useStoresQuery({ enabled }) {
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  async function fetcher() {
    return await fetch(getStores(sheetId.value))
  }

  return useQuery('stores', fetcher, { enabled })
}
