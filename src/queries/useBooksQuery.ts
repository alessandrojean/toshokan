import { type UseQueryOptions, useQuery } from '@tanstack/vue-query'
import { type ComputedRef, type Ref, computed } from 'vue'

import { PropertyToColumn } from '@/model/Book'
import type { GetBooksArgs } from '@/services/sheet/getBooks'
import getBooks from '@/services/sheet/getBooks'
import { useSheetStore } from '@/stores/sheet'
import type { Sort } from '@/types'
import { fetch } from '@/util/gapi'

type RefOrComputed<T> = Ref<T> | ComputedRef<T>

type GetBooksReturn = Awaited<ReturnType<typeof getBooks>> | undefined
type UseBooksQueryOptions<S> = UseQueryOptions<GetBooksReturn, Error, S> & {
  favorites: RefOrComputed<GetBooksArgs['favorites']>
  futureItems: RefOrComputed<GetBooksArgs['futureItems']>
  groups: RefOrComputed<GetBooksArgs['groups']>
  page: RefOrComputed<number>
  perPage?: number
  sortBy: RefOrComputed<string>
  sortDirection: RefOrComputed<Sort>
}

export default function useBooksQuery<S = GetBooksReturn>(options: UseBooksQueryOptions<S>) {
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  return useQuery({
    queryKey: [
      'books',
      {
        favorites: options.favorites,
        futureItems: options.futureItems,
        groups: options.groups,
        page: options.page,
        sortBy: options.sortBy,
        sortDirection: options.sortDirection,
        perPage: options.perPage,
        sheetId,
      },
    ],
    queryFn: async () => {
      const promise = getBooks(sheetId.value!, options.page.value, {
        favorites: options.favorites.value,
        futureItems: options.futureItems.value,
        groups: options.groups.value,
        orderBy: PropertyToColumn[options.sortBy.value],
        orderDirection: options.sortDirection.value,
        limit: options.perPage ?? 18,
      })

      return await fetch(promise)
    },
    ...options,
  })
}
