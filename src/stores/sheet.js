import { defineStore } from 'pinia'

import SheetService from '@/services/sheet'
import { useSettingsStore } from './settings'

export const useSheetStore = defineStore('sheet', {
  state: () => ({
    isEmpty: false,
    options: [],
    selected: null,
    sheetId: null
  }),
  getters: {
    canChange () {
      return this.options.length > 1
    },

    canEdit () {
      return this.selected?.capabilities?.canEdit
    },

    loadedOnce () {
      return this.sheetId !== null
    },

    loading () {
      return this.sheetId === null
    },

    ownerDisplayName () {
      return this.selected?.owners?.[0]?.displayName
    },

    ownerPictureUrl () {
      return this.selected?.owners?.[0]?.photoLink
    },

    shared () {
      return this.selected && this.selected.ownedByMe === false
    }
  },
  actions: {
    /**
     * Attempt to find the sheet ID.
     *
     * @returns {Promise<string>} the sheet ID
     */
    async findSheetId () {
      const settingsStore = useSettingsStore()
      const useDevSheet = settingsStore.useDevSheet

      const { sheet, options } = await SheetService.findSheetId(useDevSheet)

      this.updateSheetId(sheet.id)
      this.updateSelected(sheet)
      this.updateOptions(options)

      return sheet.id
    },

    updateIsEmpty (isEmpty) {
      this.isEmpty = isEmpty
    },

    updateOptions (options) {
      this.options = options ? options.slice() : []
    },

    updateSelected (sheet) {
      this.selected = sheet ? { ...this.selected, ...sheet } : null
    },

    updateSheetId (sheetId) {
      this.sheetId = sheetId
      localStorage.setItem('last_sheet_opened', sheetId)
    }
  }
})
