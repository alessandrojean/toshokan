import { computed } from 'vue'
import { useQuery } from 'vue-query'

import { useSheetStore } from '@/stores/sheet'
import getGroups from '@/services/sheet/getGroups'

export default function useGroupsQuery({ enabled }) {
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  async function fetcher() {
    return await getGroups(sheetId.value)
  }

  return useQuery('groups', fetcher, { enabled })
}
