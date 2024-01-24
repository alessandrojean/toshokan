import { type UseQueryOptions, useQuery } from '@tanstack/vue-query'
import { type Ref, computed } from 'vue'

import getReadBooksInYear from '@/services/sheet/getReadBooksInYear'
import { useSheetStore } from '@/stores/sheet'
import { fetch } from '@/util/gapi'

export interface UseReadBooksInYearQueryArgs {
  year: Ref<number>
}
type GetReadBooksInYearReturn = Awaited<ReturnType<typeof getReadBooksInYear>> | undefined
type UseReadBooksInYearQueryOptions<S> = UseQueryOptions<GetReadBooksInYearReturn, Error, S> & UseReadBooksInYearQueryArgs

export default function useReadBooksInYearQuery<S = GetReadBooksInYearReturn>(options: UseReadBooksInYearQueryOptions<S>) {
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  return useQuery({
    queryKey: ['read-books', { year: options.year, sheetId }],
    queryFn: async () => {
      return await fetch(getReadBooksInYear(sheetId.value!, options.year.value))
    },
    ...options,
  })
}
