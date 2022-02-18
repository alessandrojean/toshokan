import { readonly, ref, watch } from 'vue'

import SheetService from '@/services/sheet'

import { useCollectionStore } from '@/stores/collection'
import { useSheetStore } from '@/stores/sheet'

export default function useBookBulkDeleter (books) {
  const collectionStore = useCollectionStore()
  const sheetStore = useSheetStore()
  const deleting = ref(false)
  const deleted = ref(false)

  async function bulkDeleteBooks () {
    deleting.value = true
    sheetStore.updateLoading(true)

    await SheetService.bulkDeleteBooks(sheetStore.sheetId, books.value)
    await sheetStore.loadSheetData(true)
    await collectionStore.fetchGroups()
    collectionStore.clearCarouselItems('lastAdded', 'latestReadings')
    collectionStore.clearItems(null, 'books')

    sheetStore.updateLoading(false)
    deleting.value = false
    deleted.value = true
  }

  watch(books, () => {
    deleted.value = false
  })

  return {
    bulkDeleteBooks,
    deleted: readonly(deleted),
    deleting: readonly(deleting)
  }
}
