import { acceptHMRUpdate, defineStore } from 'pinia'

export const useStore = defineStore('main', {
  state: () => ({
    criticalError: null as any | null,
  }),
  getters: {
    hasCriticalError(): boolean {
      return this.criticalError !== null
    },
  },
  actions: {
    clearCriticalError() {
      this.updateCriticalError(null)
    },

    updateCriticalError(error: any | null) {
      this.criticalError = error
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStore, import.meta.hot))
}
