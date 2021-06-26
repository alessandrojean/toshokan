import { ref } from 'vue'
import { useStore } from 'vuex'

import { insertBook as sheetInsertBook } from '@/services/sheet'

export default function useBookInserter (book) {
  const store = useStore()
  const inserting = ref(false)

  async function insertBook () {
    inserting.value = true
    store.commit('sheet/updateLoading', true)

    const bookToInsert = {
      ...book,
      labelPrice: {
        currency: book.labelPriceCurrency,
        value: book.labelPriceValue
      },
      paidPrice: {
        currency: book.paidPriceCurrency,
        value: book.paidPriceValue
      }
    }

    const bookId = await sheetInsertBook(store.state.sheet.sheetId, bookToInsert)
    await store.dispatch('sheet/loadSheetData')

    inserting.value = false
    store.commit('sheet/updateLoading', false)

    return bookId
  }

  return {
    insertBook,
    inserting
  }
}
