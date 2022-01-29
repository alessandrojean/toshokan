import { computed, readonly, ref, toRaw } from 'vue'
import { useStore } from 'vuex'

import SheetService from '@/services/sheet'

import { MutationTypes } from '@/store'

export default function useBookInserter (book) {
  const store = useStore()
  const inserting = ref(false)

  const sheetId = computed(() => store.state.sheet.sheetId)
  const idMap = computed(() => store.state.collection.idMap)

  async function checkIfExists (code) {
    try {
      if (Object.keys(idMap.value).length === 0) {
        await store.dispatch('collection/fetchIdMap')
      }

      const books = await SheetService.getBookByCode(sheetId.value, idMap.value, code)

      if (!books || books.length === 0) {
        return null
      }

      return books.map(b => b.id)
    } catch (e) {
      return null
    }
  }

  async function insertBook () {
    inserting.value = true
    store.commit(MutationTypes.SHEET_UPDATE_LOADING, true)

    const bookToInsert = toRaw(book)

    const bookId = await SheetService.insertBook(store.state.sheet.sheetId, bookToInsert)
    await store.dispatch('sheet/loadSheetData', true)
    await store.dispatch('collection/fetchGroups')
    await store.dispatch('collection/fetchIdMap')

    // Also select the new book group so it will be shown in library.
    const groups = store.state.collection.filters.groups

    if (!groups.selected.includes(book.group) && groups.selected.length > 0) {
      store.commit(MutationTypes.COLLECTION_UPDATE_GROUPS, {
        selected: groups.selected.concat(book.group)
      })
    }

    await store.dispatch('collection/fetchBooks')
    await store.dispatch('collection/fetchLastAdded')

    inserting.value = false
    store.commit(MutationTypes.SHEET_UPDATE_LOADING, false)

    return bookId
  }

  return {
    checkIfExists,
    insertBook,
    inserting: readonly(inserting)
  }
}
