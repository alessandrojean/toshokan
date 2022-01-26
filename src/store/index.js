import { createStore } from 'vuex'

import auth, { AuthMutations } from './modules/auth'
import collection, { CollectionMutations } from './modules/collection'
import search, { SearchMutations } from './modules/search'
import settings, { SettingsMutations } from './modules/settings'
import sheet, { SheetMutations } from './modules/sheet'

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

export const GlobalMutations = {
  CLEAR_CRITICAL_ERROR: 'clearCriticalError',
  UPDATE_CRITICAL_ERROR: 'updateCriticalError',
  UPDATE_THEME: 'updateTheme'
}

/**
 * Create the full mutation types object.
 *
 * @returns {Record<string, string>}
 */
function createMutationTypes () {
  const modules = {
    AUTH: AuthMutations,
    COLLECTION: CollectionMutations,
    SEARCH: SearchMutations,
    SETTINGS: SettingsMutations,
    SHEET: SheetMutations
  }

  const MutationTypes = Object
    .entries(modules)
    .flatMap(([module, mutations]) => {
      return Object.entries(mutations)
        .map(([mutationKey, mutationValue]) => [
          `${module}_${mutationKey}`,
          `${module.toLowerCase()}/${mutationValue}`
        ])
    })
    .concat(Object.entries(GlobalMutations))

  return Object.fromEntries(MutationTypes)
}

export const MutationTypes = createMutationTypes()

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
    [GlobalMutations.CLEAR_CRITICAL_ERROR] (state) {
      state.criticalError = null
    },

    [GlobalMutations.UPDATE_CRITICAL_ERROR] (state, error) {
      state.criticalError = error
    },

    [GlobalMutations.UPDATE_THEME] (state, theme) {
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
    search,
    settings,
    sheet
  }
})

export default store
