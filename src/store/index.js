import { createStore } from 'vuex'

import auth from './modules/auth'
import collection from './modules/collection'
import sheet from './modules/sheet'

function getTheme () {
  const theme = localStorage.getItem('theme')

  if (theme === null) {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark')
    }

    return 'system'
  }

  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
    return 'dark'
  }

  document.documentElement.classList.remove('dark')
  return 'light'
}

/**
 * @param {MediaQueryListEvent} event
 */
function handleThemeChange (event) {
  if (store.state.theme === 'system') {
    if (event.matches) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
}

window.matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', handleThemeChange)

const store = createStore({
  state: {
    criticalError: null,
    theme: getTheme()
  },
  getters: {
    hasCriticalError (state) {
      return state.criticalError !== null
    }
  },
  mutations: {
    clearCriticalError (state) {
      state.criticalError = null
    },
    updateCriticalError (state, error) {
      state.criticalError = error
    },
    updateTheme (state, theme) {
      state.theme = theme

      if (theme === 'system') {
        localStorage.removeItem('theme')

        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      } else if (theme === 'dark') {
        localStorage.setItem('theme', 'dark')
        document.documentElement.classList.add('dark')
      } else {
        localStorage.setItem('theme', 'light')
        document.documentElement.classList.remove('dark')
      }
    }
  },
  actions: {
  },
  modules: {
    auth,
    collection,
    sheet
  }
})

export default store
