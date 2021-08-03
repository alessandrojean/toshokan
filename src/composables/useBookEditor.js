import { ref } from 'vue'
import { useStore } from 'vuex'

import { updateBook as sheetUpdateBook } from '@/services/sheet'

export default function useBookEditor (book) {
  const store = useStore()
  const updating = ref(false)

  async function updateBook (overrideBook) {
    updating.value = true
    store.commit('sheet/updateLoading', true)

    const orgBook = overrideBook || book

    const bookToUpdate = {
      ...orgBook,
      labelPrice: {
        currency: orgBook.labelPriceCurrency,
        value: orgBook.labelPriceValue
      },
      paidPrice: {
        currency: orgBook.paidPriceCurrency,
        value: orgBook.paidPriceValue
      }
    }

    const bookId = await sheetUpdateBook(store.state.sheet.sheetId, bookToUpdate)
    await store.dispatch('sheet/loadSheetData')
    await store.dispatch('collection/fetchGroups')
    store.commit('collection/updateLastAdded', { items: [] })
    store.commit('collection/updateLatestReadings', { items: [] })
    store.commit('collection/updateBooks', { items: [] })

    updating.value = false
    store.commit('sheet/updateLoading', false)

    return bookId
  }

  return {
    updateBook,
    updating
  }
}
