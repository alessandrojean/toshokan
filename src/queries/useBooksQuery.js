import { computed } from 'vue'
import { useQuery } from 'vue-query'

import { useSheetStore } from '@/stores/sheet'
import getBooks from '@/services/sheet/getBooks'
import { PropertyToColumn } from '@/model/Book'

export default function useBooksQuery(
  { favorites, futureItems, groups, page, sortBy, sortDirection },
  { enabled }
) {
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  async function fetcher() {
    return await getBooks(sheetId.value, page.value, {
      favorites: favorites.value,
      futureItems: futureItems.value,
      groups: groups.value,
      orderBy: PropertyToColumn[sortBy.value],
      orderDirection: sortDirection.value
    })
  }

  return useQuery(
    ['books', { favorites, futureItems, groups, page, sortBy, sortDirection }],
    fetcher,
    { enabled }
  )
}
