import { acceptHMRUpdate, defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

const LocalStorageKeys = {
  BLUR_NSFW: 'blur_nsfw',
  GRID_MODE: 'grid_mode',
  SHOW_VUE_QUERY_DEV_TOOLS: 'show_vue_query_dev_tools',
  SPOILER_MODE_COVER: 'spoiler_mode_cover',
  SPOILER_MODE_SYNOPSIS: 'spoiler_mode_synopsis',
  THEME: 'theme',
  VIEW_MODE: 'view_mode'
}

export const THEME_SYSTEM = 'system'
export const THEME_DARK = 'dark'
export const THEME_LIGHT = 'light'

export function getTheme() {
  const theme = localStorage.getItem(LocalStorageKeys.THEME)

  if (theme === null) {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add(THEME_DARK)
    }

    return THEME_SYSTEM
  }

  if (theme === THEME_DARK) {
    document.documentElement.classList.add(THEME_DARK)
    return THEME_DARK
  }

  document.documentElement.classList.remove(THEME_DARK)
  return THEME_LIGHT
}

/**
 * @param {MediaQueryListEvent} event
 */
function handleThemeChange(event) {
  const settingsStore = useSettingsStore()

  if (settingsStore.theme === THEME_SYSTEM) {
    if (event.matches) {
      document.documentElement.classList.add(THEME_DARK)
    } else {
      document.documentElement.classList.remove(THEME_DARK)
    }
  }
}

window
  .matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', handleThemeChange)

const isDevEnvironment = !!import.meta.env.DEV

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    blurNsfw: useLocalStorage(LocalStorageKeys.BLUR_NSFW, false),
    gridMode: useLocalStorage(LocalStorageKeys.GRID_MODE, 'comfortable'),
    showVueQueryDevTools:
      isDevEnvironment &&
      localStorage.getItem(LocalStorageKeys.SHOW_VUE_QUERY_DEV_TOOLS) ===
        'true',
    spoilerMode: {
      cover: useLocalStorage(LocalStorageKeys.SPOILER_MODE_COVER, false),
      synopsis: useLocalStorage(LocalStorageKeys.SPOILER_MODE_SYNOPSIS, false)
    },
    theme: getTheme(),
    useDevSheet: isDevEnvironment,
    viewMode: useLocalStorage(LocalStorageKeys.VIEW_MODE, 'grid')
  }),
  actions: {
    updateBlurNsfw(blurNsfw) {
      this.blurNsfw = blurNsfw
    },

    updateGridMode(gridMode) {
      this.gridMode = gridMode
    },

    updateShowVueQueryDevTools(showVueQueryDevTools) {
      this.showVueQueryDevTools = showVueQueryDevTools

      localStorage.setItem(
        LocalStorageKeys.SHOW_VUE_QUERY_DEV_TOOLS,
        showVueQueryDevTools
      )
    },

    updateSpoilerMode(spoilerMode) {
      this.spoilerMode.cover = spoilerMode.cover || this.spoilerMode.cover
      this.spoilerMode.synopsis =
        spoilerMode.synopsis || this.spoilerMode.synopsis
    },

    updateTheme(theme) {
      this.theme = theme

      if (theme === THEME_SYSTEM) {
        localStorage.removeItem(LocalStorageKeys.THEME)

        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          document.documentElement.classList.add(THEME_DARK)
        } else {
          document.documentElement.classList.remove(THEME_DARK)
        }
      } else if (theme === THEME_DARK) {
        localStorage.setItem(LocalStorageKeys.THEME, THEME_DARK)
        document.documentElement.classList.add(THEME_DARK)
      } else {
        localStorage.setItem(LocalStorageKeys.THEME, THEME_LIGHT)
        document.documentElement.classList.remove(THEME_DARK)
      }
    },

    updateUseDevSheet(useDevSheet) {
      this.useDevSheet = useDevSheet
    },

    updateViewMode(viewMode) {
      this.viewMode = viewMode
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSettingsStore, import.meta.hot))
}
