import { computed, ref } from 'vue'

import { searchByIsbn } from '@/services/cbl'

export function useSearchAvailable () {
  return ref(
    process.env.VUE_APP_CBL_QUERY_KEY &&
      process.env.VUE_APP_CBL_QUERY_KEY.length > 0
  )
}

export default function useIsbnSearch (isbnRef) {
  const available = useSearchAvailable()
  const errorMessage = ref('')
  const result = ref()
  const searching = ref(false)
  const noResultsFound = ref(false)

  const failed = computed(() => errorMessage.value.length > 0)

  function clear () {
    noResultsFound.value = false
    result.value = undefined
    searching.value = false
    errorMessage.value = false
  }

  async function search () {
    if (isbnRef.value.length === 0) {
      return
    }

    try {
      searching.value = true

      const results = await searchByIsbn(isbnRef.value)
      result.value = results[0]

      noResultsFound.value = !result.value
      searching.value = false
      errorMessage.value = ''
    } catch (e) {
      noResultsFound.value = false
      result.value = undefined
      searching.value = false
      errorMessage.value = e.message
    }
  }

  return {
    available,
    clear,
    errorMessage,
    failed,
    noResultsFound,
    result,
    search,
    searching
  }
}
