import { computed, type Ref } from 'vue'
import { useQuery, type UseQueryOptions } from '@tanstack/vue-query'

import getBookByCode from '@/services/sheet/getBookByCode'
import { useSheetStore } from '@/stores/sheet'
import { fetch } from '@/util/gapi'

export default function useBookExistsQuery(
  isbn: Ref<string>,
  { enabled }: UseQueryOptions
) {
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  async function fetcher() {
    return await fetch(getBookByCode(sheetId.value!, isbn.value))
  }

  return useQuery(['book-exists', { isbn, sheetId }], fetcher, { enabled })
}
