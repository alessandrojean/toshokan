import { type UseQueryOptions, useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'

import getGroups from '@/services/sheet/getGroups'
import { useSheetStore } from '@/stores/sheet'
import { fetch } from '@/util/gapi'

type GetGroupsReturn = Awaited<ReturnType<typeof getGroups>> | undefined
export type GroupData = Awaited<ReturnType<typeof getGroups>>[number]
type UseGroupsQueryOptions<S> = UseQueryOptions<GetGroupsReturn, Error, S>

export default function useGroupsQuery<S = GetGroupsReturn>(options: UseGroupsQueryOptions<S> = {}) {
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  return useQuery({
    queryKey: ['groups', { sheetId }],
    queryFn: async () => {
      return await fetch(getGroups(sheetId.value!))
    },
    ...options,
  })
}
