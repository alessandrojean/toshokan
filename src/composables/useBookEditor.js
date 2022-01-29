import { readonly, ref } from 'vue'
import { useStore } from 'vuex'

import SheetService from '@/services/sheet'

import { MutationTypes } from '@/store'

export default function useBookEditor (book) {
  const store = useStore()
  const updating = ref(false)

  /**
   * Update the book in the sheet.
   *
   * @param {import('../model/Book').default} overrideBook
   * @returns {Promise<string>}
   */
  async function updateBook (overrideBook) {
    updating.value = true
    store.commit(MutationTypes.SHEET_UPDATE_LOADING, true)

    const bookToUpdate = overrideBook || book

    const bookId = await SheetService.updateBook(store.state.sheet.sheetId, bookToUpdate)
    await store.dispatch('sheet/loadSheetData', true)
    await store.dispatch('collection/fetchGroups')

    // Also select the new book group so it will be shown in library.
    const groups = store.state.collection.filters.groups

    if (!groups.selected.includes(bookToUpdate.group) && groups.selected.length > 0) {
      store.commit(MutationTypes.COLLECTION_UPDATE_GROUPS, {
        selected: groups.selected.concat(bookToUpdate.group)
      })
    }

    store.commit(MutationTypes.COLLECTION_UPDATE_LAST_ADDED, { items: [] })
    store.commit(MutationTypes.COLLECTION_UPDATE_LATEST_READINGS, { items: [] })
    store.commit(MutationTypes.COLLECTION_UPDATE_BOOKS, { items: [] })

    updating.value = false
    store.commit(MutationTypes.SHEET_UPDATE_LOADING, false)

    return bookId
  }

  return {
    updateBook,
    updating: readonly(updating)
  }
}
