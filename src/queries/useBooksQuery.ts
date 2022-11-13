import { computed, type ComputedRef, type Ref } from 'vue'
import { useQuery, type UseQueryOptions } from '@tanstack/vue-query'

import { PropertyToColumn } from '@/model/Book'
import getBooks, { GetBooksArgs } from '@/services/sheet/getBooks'
import { useSheetStore } from '@/stores/sheet'
import { fetch } from '@/util/gapi'
import type { Sort } from '@/types'

type RefOrComputed<T> = Ref<T> | ComputedRef<T>

type UseBooksQueryArgs = {
  favorites: RefOrComputed<GetBooksArgs['favorites']>
  futureItems: RefOrComputed<GetBooksArgs['futureItems']>
  groups: RefOrComputed<GetBooksArgs['groups']>
  page: RefOrComputed<number>
  perPage?: number
  sortBy: RefOrComputed<string>
  sortDirection: RefOrComputed<Sort>
}

export default function useBooksQuery(
  {
    favorites,
    futureItems,
    groups,
    page,
    perPage = 18,
    sortBy,
    sortDirection
  }: UseBooksQueryArgs,
  { enabled }: UseQueryOptions
) {
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  async function fetcher() {
    const promise = getBooks(sheetId.value!, page.value, {
      favorites: favorites.value,
      futureItems: futureItems.value,
      groups: groups.value,
      orderBy: PropertyToColumn[sortBy.value],
      orderDirection: sortDirection.value,
      limit: perPage
    })

    return await fetch(promise)
  }

  return useQuery(
    ['books', { favorites, futureItems, groups, page, sortBy, sortDirection }],
    fetcher,
    { enabled }
  )
}
