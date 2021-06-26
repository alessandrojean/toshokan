import { ref } from 'vue'
import { findCovers } from '@/services/cover'

export default function useCoverFinder (book) {
  const finding = ref(false)
  const results = ref([])

  async function findCover () {
    finding.value = true
    results.value = await findCovers(book)
    finding.value = false
  }

  async function clearResults () {
    results.value = []
  }

  return {
    clearResults,
    findCover,
    finding,
    results
  }
}
