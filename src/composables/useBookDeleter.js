import { ref } from 'vue'
import { useStore } from 'vuex'

import { deleteBook as sheetDeleteBook } from '@/services/sheet'

export default function useBookDeleter (book) {
  const store = useStore()
  const deleting = ref(false)

  async function deleteBook () {
    deleting.value = true
    store.commit('sheet/updateLoading', true)

    await sheetDeleteBook(store.state.sheet.sheetId, book.value)
    await store.dispatch('sheet/loadSheetData')
    await store.dispatch('collection/fetchGroups')
    await store.dispatch('collection/fetchIdMap')
    store.commit('collection/updateLastAdded', { items: [] })
    store.commit('collection/updateLatestReadings', { items: [] })
    store.commit('collection/updateBooks', { items: [] })

    deleting.value = false
    store.commit('sheet/updateLoading', false)
  }

  return {
    deleteBook,
    deleting
  }
}
