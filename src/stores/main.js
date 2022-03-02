import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
  state: () => ({
    criticalError: null
  }),
  getters: {
    hasCriticalError() {
      return this.criticalError !== null
    }
  },
  actions: {
    clearCriticalError() {
      this.updateCriticalError(null)
    },

    updateCriticalError(error) {
      this.criticalError = error
    }
  }
})
