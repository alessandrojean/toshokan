import { type UseQueryOptions, useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'

import getAuthors from '@/services/sheet/getAuthors'
import { useSheetStore } from '@/stores/sheet'
import { fetch } from '@/util/gapi'

type GetAuthorsReturn = string[] | undefined
type UseAuthorsQueryOptions<S = string[]> = UseQueryOptions<GetAuthorsReturn, Error, S>

export default function useAuthorsQuery<S = GetAuthorsReturn>(options: UseAuthorsQueryOptions<S> = {}) {
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  return useQuery({
    queryKey: ['authors', { sheetId }],
    queryFn: async () => {
      return await fetch(getAuthors(sheetId.value!))
    },
    ...options,
  })
}
