import { ref } from 'vue'
import { useStore } from 'vuex'

import { insertBook as sheetInsertBook } from '@/services/sheet'

import { MutationTypes } from '@/store'

export default function useBookInserter (book) {
  const store = useStore()
  const inserting = ref(false)

  async function insertBook () {
    inserting.value = true
    store.commit(MutationTypes.SHEET_UPDATE_LOADING, true)

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
    await store.dispatch('collection/fetchGroups')
    await store.dispatch('collection/fetchIdMap')
    store.commit(MutationTypes.COLLECTION_UPDATE_LAST_ADDED, { items: [] })
    store.commit(MutationTypes.COLLECTION_UPDATE_BOOKS, { items: [] })

    inserting.value = false
    store.commit(MutationTypes.SHEET_UPDATE_LOADING, false)

    return bookId
  }

  return {
    insertBook,
    inserting
  }
}
