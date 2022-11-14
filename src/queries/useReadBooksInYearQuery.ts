import { computed, type Ref } from 'vue'
import { useQuery, type UseQueryOptions } from '@tanstack/vue-query'

import { useSheetStore } from '@/stores/sheet'
import { fetch } from '@/util/gapi'
import getReadBooksInYear from '@/services/sheet/getReadBooksInYear'

export interface UseReadBooksInYearQueryArgs {
  year: Ref<number>
}

export default function useReadBooksInYearQuery(
  { year }: UseReadBooksInYearQueryArgs,
  { enabled }: UseQueryOptions
) {
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  async function fetcher() {
    return await fetch(getReadBooksInYear(sheetId.value!, year.value))
  }

  return useQuery(['read-books', { year, sheetId }], fetcher, { enabled })
}
