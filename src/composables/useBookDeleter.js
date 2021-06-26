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

    deleting.value = false
    store.commit('sheet/updateLoading', false)
  }

  return {
    deleteBook,
    deleting
  }
}
