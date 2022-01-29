import { readonly, ref, watch } from 'vue'
import { useStore } from 'vuex'

import SheetService from '@/services/sheet'

import { MutationTypes } from '@/store'

export default function useBookDeleter (book) {
  const store = useStore()
  const deleting = ref(false)
  const deleted = ref(false)

  async function deleteBook () {
    deleting.value = true
    store.commit(MutationTypes.SHEET_UPDATE_LOADING, true)

    await SheetService.deleteBook(store.state.sheet.sheetId, book.value)
    await store.dispatch('sheet/loadSheetData', true)
    await store.dispatch('collection/fetchGroups')
    await store.dispatch('collection/fetchIdMap')
    store.commit(MutationTypes.COLLECTION_UPDATE_LAST_ADDED, { items: [] })
    store.commit(MutationTypes.COLLECTION_UPDATE_LATEST_READINGS, { items: [] })
    store.commit(MutationTypes.COLLECTION_UPDATE_BOOKS, { items: [] })

    store.commit(MutationTypes.SHEET_UPDATE_LOADING, false)
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
