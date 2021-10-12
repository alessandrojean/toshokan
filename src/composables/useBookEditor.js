import { readonly, ref } from 'vue'
import { useStore } from 'vuex'

import { updateBook as sheetUpdateBook } from '@/services/sheet'

import { MutationTypes } from '@/store'

export default function useBookEditor (book) {
  const store = useStore()
  const updating = ref(false)

  async function updateBook (overrideBook) {
    updating.value = true
    store.commit(MutationTypes.SHEET_UPDATE_LOADING, true)

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
    await store.dispatch('sheet/loadSheetData', true)
    await store.dispatch('collection/fetchGroups')
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
