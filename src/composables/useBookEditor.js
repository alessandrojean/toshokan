import { readonly, ref } from 'vue'

import SheetService from '@/services/sheet'

import { useCollectionStore } from '@/stores/collection'
import { useSheetStore } from '@/stores/sheet'

export default function useBookEditor (book) {
  const collectionStore = useCollectionStore()
  const sheetStore = useSheetStore()
  const updating = ref(false)

  /**
   * Update the book in the sheet.
   *
   * @param {import('../model/Book').default} overrideBook
   * @returns {Promise<string>}
   */
  async function updateBook (overrideBook) {
    updating.value = true
    sheetStore.updateLoading(true)

    const bookToUpdate = overrideBook || book

    const bookId = await SheetService.updateBook(sheetStore.sheetId, bookToUpdate)
    await sheetStore.loadSheetData(true)
    await collectionStore.fetchGroups()

    // Also select the new book group so it will be shown in library.
    const groups = collectionStore.filters.groups

    if (!groups.selected.includes(bookToUpdate.group) && groups.selected.length > 0) {
      collectionStore.updateGroups({
        selected: groups.selected.concat(bookToUpdate.group)
      })
    }

    collectionStore.clearCarouselItems('lastAdded', 'latestReadings')
    collectionStore.clearItems(null, 'books')

    updating.value = false
    sheetStore.updateLoading(false)

    return bookId
  }

  return {
    updateBook,
    updating: readonly(updating)
  }
}
