import { defineStore } from 'pinia'

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

export function getTheme () {
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
function handleThemeChange (event) {
  const settingsStore = useSettingsStore()

  if (settingsStore.theme === THEME_SYSTEM) {
    if (event.matches) {
      document.documentElement.classList.add(THEME_DARK)
    } else {
      document.documentElement.classList.remove(THEME_DARK)
    }
  }
}

window.matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', handleThemeChange)

const isDevEnvironment = !!import.meta.env.DEV

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    blurNsfw: localStorage.getItem(LocalStorageKeys.BLUR_NSFW) === 'true',
    gridMode: localStorage.getItem(LocalStorageKeys.GRID_MODE) || 'comfortable',
    showVueQueryDevTools: isDevEnvironment &&
      localStorage.getItem(LocalStorageKeys.SHOW_VUE_QUERY_DEV_TOOLS) === 'true',
    spoilerMode: {
      cover: localStorage.getItem(LocalStorageKeys.SPOILER_MODE_COVER) === 'true',
      synopsis: localStorage.getItem(LocalStorageKeys.SPOILER_MODE_SYNOPSIS) === 'true'
    },
    theme: getTheme(),
    useDevSheet: isDevEnvironment,
    viewMode: localStorage.getItem(LocalStorageKeys.VIEW_MODE) || 'grid'
  }),
  actions: {
    updateBlurNsfw (blurNsfw) {
      this.blurNsfw = blurNsfw

      localStorage.setItem(LocalStorageKeys.BLUR_NSFW, blurNsfw)
    },

    updateGridMode (gridMode) {
      this.gridMode = gridMode

      localStorage.setItem(LocalStorageKeys.GRID_MODE, gridMode)
    },

    updateShowVueQueryDevTools (showVueQueryDevTools) {
      this.showVueQueryDevTools = showVueQueryDevTools

      localStorage.setItem(LocalStorageKeys.SHOW_VUE_QUERY_DEV_TOOLS, showVueQueryDevTools)
    },

    updateSpoilerMode (spoilerMode) {
      this.spoilerMode.cover = spoilerMode.cover || this.spoilerMode.cover
      this.spoilerMode.synopsis = spoilerMode.synopsis || this.spoilerMode.synopsis

      localStorage.setItem(
        LocalStorageKeys.SPOILER_MODE_COVER,
        this.spoilerMode.cover
      )
      localStorage.setItem(
        LocalStorageKeys.SPOILER_MODE_SYNOPSIS,
        this.spoilerMode.synopsis
      )
    },

    updateTheme (theme) {
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

    updateUseDevSheet (useDevSheet) {
      this.useDevSheet = useDevSheet
    },

    updateViewMode (viewMode) {
      this.viewMode = viewMode

      localStorage.setItem(LocalStorageKeys.VIEW_MODE, viewMode)
    }
  }
})
