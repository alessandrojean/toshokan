import { readonly, ref } from 'vue'
import { useStore } from 'vuex'

import { deleteBook as sheetDeleteBook } from '@/services/sheet'

import { MutationTypes } from '@/store'

export default function useBookDeleter (book) {
  const store = useStore()
  const deleting = ref(false)

  async function deleteBook () {
    deleting.value = true
    store.commit(MutationTypes.SHEET_UPDATE_LOADING, true)

    await sheetDeleteBook(store.state.sheet.sheetId, book.value)
    await store.dispatch('sheet/loadSheetData')
    await store.dispatch('collection/fetchGroups')
    await store.dispatch('collection/fetchIdMap')
    store.commit(MutationTypes.COLLECTION_UPDATE_LAST_ADDED, { items: [] })
    store.commit(MutationTypes.COLLECTION_UPDATE_LATEST_READINGS, { items: [] })
    store.commit(MutationTypes.COLLECTION_UPDATE_BOOKS, { items: [] })

    deleting.value = false
    store.commit(MutationTypes.SHEET_UPDATE_LOADING, false)
  }

  return {
    deleteBook,
    deleting: readonly(deleting)
  }
}
