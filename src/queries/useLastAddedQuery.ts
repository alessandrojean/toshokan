import { computed } from 'vue'
import { useQuery, type UseQueryOptions } from '@tanstack/vue-query'

import getBooks from '@/services/sheet/getBooks'
import { useSheetStore } from '@/stores/sheet'
import { fetch } from '@/util/gapi'

export default function useLastAddedQuery({ enabled }: UseQueryOptions) {
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  async function fetcher() {
    const promise = getBooks(sheetId.value!, 1, {
      limit: 6,
      dontCount: true
    })

    const result = await fetch(promise)

    return result?.books
  }

  return useQuery(['last-added'], fetcher, { enabled })
}
