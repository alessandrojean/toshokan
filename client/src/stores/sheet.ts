import { acceptHMRUpdate, defineStore } from 'pinia'

import { useSettingsStore } from './settings'
import SheetService from '@/services/sheet'

type File = gapi.client.drive.File

export const useSheetStore = defineStore('sheet', {
  state: () => ({
    isEmpty: false,
    options: [] as File[],
    selected: null as File | null,
    sheetId: null as string | null,
  }),
  getters: {
    canChange(): boolean {
      return this.options.length > 1
    },

    canEdit(): boolean {
      return this.selected?.capabilities?.canEdit === true
    },

    loadedOnce(): boolean {
      return this.sheetId !== null
    },

    loading(): boolean {
      return this.sheetId === null
    },

    ownerDisplayName(): string | undefined {
      return this.selected?.owners?.[0]?.displayName
    },

    ownerPictureUrl(): string | undefined {
      return this.selected?.owners?.[0]?.photoLink
    },

    shared(): boolean {
      return this.selected?.ownedByMe === false
    },
  },
  actions: {
    /**
     * Attempt to find the sheet ID.
     *
     * @returns {Promise<string>} the sheet ID
     */
    async findSheetId(): Promise<string | undefined> {
      const settingsStore = useSettingsStore()
      const useDevSheet = settingsStore.useDevSheet

      const { sheet, options } = await SheetService.findSheetId(useDevSheet)

      this.updateSheetId(sheet.id ?? null)
      this.updateSelected(sheet)
      this.updateOptions(options ?? [])

      return sheet.id
    },

    updateIsEmpty(isEmpty: boolean) {
      this.isEmpty = isEmpty
    },

    updateOptions(options: File[]) {
      this.options = options ? options.slice() : []
    },

    updateSelected(sheet: File) {
      this.selected = sheet ? { ...this.selected, ...sheet } : null
    },

    updateSheetId(sheetId: string | null) {
      this.sheetId = sheetId
      localStorage.setItem('last_sheet_opened', sheetId ?? '')
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSheetStore, import.meta.hot))
}
