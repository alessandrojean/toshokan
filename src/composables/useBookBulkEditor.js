import { readonly, ref } from 'vue'

import SheetService from '@/services/sheet'

import { useCollectionStore } from '@/stores/collection'
import { useSheetStore } from '@/stores/sheet'

export default function useBookBulkEditor () {
  const collectionStore = useCollectionStore()
  const sheetStore = useSheetStore()
  const updating = ref(false)

  /**
   * Update the book in the sheet.
   *
   * @param {import('../model/Book').default[]} booksToUpdate
   * @returns {Promise<void>}
   */
  async function bulkUpdateBooks (booksToUpdate) {
    updating.value = true
    sheetStore.updateLoading(true)

    await SheetService.bulkUpdateBooks(sheetStore.sheetId, booksToUpdate)
    await sheetStore.loadSheetData(true)

    collectionStore.clearCarouselItems('latestReadings')
    collectionStore.clearItems(null, 'books')

    updating.value = false
    sheetStore.updateLoading(false)
  }

  return {
    bulkUpdateBooks,
    updating: readonly(updating)
  }
}
