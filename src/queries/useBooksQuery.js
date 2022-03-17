import { computed } from 'vue'
import { useQuery } from 'vue-query'

import { PropertyToColumn } from '@/model/Book'
import getBooks from '@/services/sheet/getBooks'
import { useSheetStore } from '@/stores/sheet'
import { fetch } from '@/util/gapi'

export default function useBooksQuery(
  { favorites, futureItems, groups, page, sortBy, sortDirection },
  { enabled }
) {
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  async function fetcher() {
    const promise = getBooks(sheetId.value, page.value, {
      favorites: favorites.value,
      futureItems: futureItems.value,
      groups: groups.value,
      orderBy: PropertyToColumn[sortBy.value],
      orderDirection: sortDirection.value
    })

    return await fetch(promise)
  }

  return useQuery(
    ['books', { favorites, futureItems, groups, page, sortBy, sortDirection }],
    fetcher,
    { enabled }
  )
}
