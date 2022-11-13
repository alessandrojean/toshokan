import { computed, type Ref } from 'vue'
import { useQuery, type UseQueryOptions } from '@tanstack/vue-query'

import getBookById from '@/services/sheet/getBookById'
import { useSheetStore } from '@/stores/sheet'
import { fetch } from '@/util/gapi'

export default function useBookQuery(
  bookId: Ref<string>,
  { enabled }: UseQueryOptions
) {
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  async function fetcher() {
    return await fetch(getBookById(sheetId.value!, bookId.value))
  }

  return useQuery(['book', bookId], fetcher, { enabled })
}
