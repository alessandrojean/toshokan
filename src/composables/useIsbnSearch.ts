import { computed, readonly, ref, type Ref } from 'vue'

import lookupSearch from '@/services/lookup'
import Book from '@/model/Book'

export default function useIsbnSearch(isbnRef: Ref<string>) {
  const errorMessage = ref('')
  const results = ref<Book[]>()
  const searching = ref(false)
  const noResultsFound = ref(false)

  const failed = computed(() => errorMessage.value.length > 0)

  function clear() {
    noResultsFound.value = false
    results.value = undefined
    searching.value = false
    errorMessage.value = ''
  }

  async function search() {
    if (isbnRef.value.length === 0) {
      return
    }

    try {
      searching.value = true

      results.value = await lookupSearch(isbnRef.value)

      noResultsFound.value = results.value.length === 0
      searching.value = false
      errorMessage.value = ''
    } catch (e: any) {
      noResultsFound.value = false
      results.value = undefined
      searching.value = false
      errorMessage.value = e.message
    }
  }

  return {
    clear,
    errorMessage: readonly(errorMessage),
    failed: readonly(failed),
    noResultsFound: readonly(noResultsFound),
    results: readonly(results),
    search,
    searching: readonly(searching)
  }
}
