import { computed } from 'vue'
import { useQuery } from 'vue-query'

import getGroups from '@/services/sheet/getGroups'
import { useSheetStore } from '@/stores/sheet'
import { fetch } from '@/util/gapi'

export default function useGroupsQuery({ enabled }) {
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  async function fetcher() {
    return await fetch(getGroups(sheetId.value))
  }

  return useQuery('groups', fetcher, { enabled })
}
