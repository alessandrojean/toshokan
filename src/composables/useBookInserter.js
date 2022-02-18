import { computed, readonly, ref, toRaw } from 'vue'

import SheetService from '@/services/sheet'

import { useCollectionStore } from '@/stores/collection'
import { useSheetStore } from '@/stores/sheet'

export default function useBookInserter (book) {
  const collectionStore = useCollectionStore()
  const sheetStore = useSheetStore()
  const inserting = ref(false)

  const sheetId = computed(() => sheetStore.sheetId)

  async function checkIfExists (code) {
    try {
      const books = await SheetService.getBookByCode(sheetId.value, code)

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
    sheetStore.updateLoading(true)

    const bookToInsert = toRaw(book)

    const bookId = await SheetService.insertBook(sheetId.value, bookToInsert)
    await sheetStore.loadSheetData(true)
    await collectionStore.fetchGroups()

    // Also select the new book group so it will be shown in library.
    const groups = collectionStore.filters.groups

    if (!groups.selected.includes(book.group) && groups.selected.length > 0) {
      collectionStore.updateGroups({
        selected: groups.selected.concat(book.group)
      })
    }

    await collectionStore.fetchBooks()
    await collectionStore.fetchLastAdded()

    inserting.value = false
    sheetStore.updateLoading(false)

    return bookId
  }

  return {
    checkIfExists,
    insertBook,
    inserting: readonly(inserting)
  }
}
