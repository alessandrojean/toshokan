import { readonly, ref, watch } from 'vue'

import SheetService from '@/services/sheet'

import { useCollectionStore } from '@/stores/collection'
import { useSheetStore } from '@/stores/sheet'

export default function useBookDeleter (book) {
  const collectionStore = useCollectionStore()
  const sheetStore = useSheetStore()
  const deleting = ref(false)
  const deleted = ref(false)

  async function deleteBook () {
    deleting.value = true
    sheetStore.updateLoading(true)

    await SheetService.deleteBook(sheetStore.sheetId, book.value)
    await sheetStore.loadSheetData(true)
    await collectionStore.fetchGroups()
    collectionStore.clearCarouselItems('lastAdded', 'latestReadings')
    collectionStore.clearItems(null, 'books')

    sheetStore.updateLoading(false)
    deleting.value = false
    deleted.value = true
  }

  watch(() => book.id, () => {
    deleted.value = false
  })

  return {
    deleteBook,
    deleted: readonly(deleted),
    deleting: readonly(deleting)
  }
}
