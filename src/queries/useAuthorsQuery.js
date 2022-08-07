import { computed } from 'vue'
import { useQuery } from 'vue-query'

import getAuthors from '@/services/sheet/getAuthors'
import { useSheetStore } from '@/stores/sheet'
import { fetch } from '@/util/gapi'

export default function useAuthorsQuery({ enabled }) {
  const sheetStore = useSheetStore()
  const sheetId = computed(() => sheetStore.sheetId)

  async function fetcher() {
    return await fetch(getAuthors(sheetId.value))
  }

  return useQuery('authors', fetcher, { enabled })
}
