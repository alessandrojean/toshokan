import { computed } from 'vue'
import { useQuery, type UseQueryOptions } from 'vue-query'

import getGroups from '@/services/sheet/getGroups'
import { useSheetStore } from '@/stores/sheet'
import { fetch } from '@/util/gapi'

export type GroupData = Awaited<ReturnType<typeof getGroups>>[number]

export default function useGroupsQuery({ enabled }: UseQueryOptions) {
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  async function fetcher() {
    return await fetch(getGroups(sheetId.value!))
  }

  return useQuery('groups', fetcher, { enabled })
}
