import { defineStore } from 'pinia'

import SheetService from '@/services/sheet'

export const useSheetStore = defineStore('sheet', {
  state: () => ({
    loadedOnce: false,
    loading: true,
    options: [],
    selected: null,
    sheetId: null,
    stats: {},
    timeZone: {
      name: 'America/Sao_Paulo',
      offset: -3,
      offsetStr: '-03:00',
      timezoneOffset: 180
    }
  }),
  getters: {
    canChange () {
      return this.options.length > 1
    },

    canEdit () {
      return this.selected?.capabilities?.canEdit
    },

    ownerDisplayName () {
      return this.selected?.owners?.[0]?.displayName
    },

    ownerPictureUrl () {
      return this.selected?.owners?.[0]?.photoLink
    },

    shared () {
      return this.selected && this.selected.ownedByMe === false
    },

    sheetIsEmpty () {
      return this.stats.count === 0
    }
  },
  actions: {
    /**
     * Attempt to find the sheet ID.
     *
     * @returns {Promise<string>} the sheet ID
     */
    async findSheetId () {
      const { sheet, options } = await SheetService.findSheetId()

      this.updateSheetId(sheet.id)
      this.updateSelected(sheet)
      this.updateOptions(options)

      return sheet.id
    },

    /**
     * Load the minimum data needed for the sheet.
     */
    async loadSheetData (persistLoading) {
      this.updateLoading(true)

      let sheetId = this.sheetId

      if (!sheetId) {
        sheetId = await this.findSheetId()
      }

      const sheetData = await SheetService.getSheetData(sheetId)

      this.updateStats(sheetData.stats)
      this.updateTimeZone(sheetData.timeZone)

      if (!persistLoading) {
        this.updateLoading(false)
      }
    },

    updateLoading (loading) {
      this.loading = loading
      this.loadedOnce = true
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
    },

    updateStats (stats) {
      this.stats = { ...this.stats, ...stats }
    },

    updateTimeZone (timeZone) {
      this.timeZone = { ...this.timeZone, ...timeZone }
    },

    resetLoadedOnce () {
      this.loadedOnce = false
    }
  }
})
