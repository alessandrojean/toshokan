import { computed, ref } from 'vue'

import lookupSearch from '@/services/lookup'

export default function useIsbnSearch (isbnRef) {
  const errorMessage = ref('')
  const results = ref(null)
  const searching = ref(false)
  const noResultsFound = ref(false)

  const failed = computed(() => errorMessage.value.length > 0)

  function clear () {
    noResultsFound.value = false
    results.value = null
    searching.value = false
    errorMessage.value = false
  }

  async function search () {
    if (isbnRef.value.length === 0) {
      return
    }

    try {
      searching.value = true

      results.value = await lookupSearch(isbnRef.value)

      noResultsFound.value = results.value.length === 0
      searching.value = false
      errorMessage.value = ''
    } catch (e) {
      noResultsFound.value = false
      results.value = null
      searching.value = false
      errorMessage.value = e.message
    }
  }

  return {
    clear,
    errorMessage,
    failed,
    noResultsFound,
    results,
    search,
    searching
  }
}
