import { computed } from 'vue'
import { useQuery, type UseQueryOptions } from '@tanstack/vue-query'

import getAuthors from '@/services/sheet/getAuthors'
import { useSheetStore } from '@/stores/sheet'
import { fetch } from '@/util/gapi'

export default function useAuthorsQuery({ enabled }: UseQueryOptions) {
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  async function fetcher() {
    return await fetch(getAuthors(sheetId.value!))
  }

  return useQuery(['authors', { sheetId }], fetcher, { enabled })
}
