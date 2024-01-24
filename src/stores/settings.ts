import { useLocalStorage } from '@vueuse/core'
import { acceptHMRUpdate, defineStore } from 'pinia'

const LocalStorageKeys = {
  BLUR_NSFW: 'blur_nsfw',
  GRID_MODE: 'grid_mode',
  SHOW_VUE_QUERY_DEV_TOOLS: 'show_vue_query_dev_tools',
  SPOILER_MODE_COVER: 'spoiler_mode_cover',
  SPOILER_MODE_SYNOPSIS: 'spoiler_mode_synopsis',
  THEME: 'theme',
  VIEW_MODE: 'view_mode',
}

export const THEME_SYSTEM: Theme = 'system'
export const THEME_DARK: Theme = 'dark'
export const THEME_LIGHT: Theme = 'light'

export type Theme = 'system' | 'dark' | 'light'

export type GridMode = 'compact' | 'comfortable'
export type ViewMode = 'grid' | 'table'

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

function handleThemeChange(event: MediaQueryListEvent) {
  // eslint-disable-next-line ts/no-use-before-define
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

const isDevEnvironment = false // !!import.meta.env.DEV

export interface SpoilerMode {
  cover?: boolean
  synopsis?: boolean
}

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    blurNsfw: useLocalStorage(LocalStorageKeys.BLUR_NSFW, false),
    gridMode: useLocalStorage<GridMode>(
      LocalStorageKeys.GRID_MODE,
      'comfortable',
    ),
    spoilerMode: {
      cover: useLocalStorage(LocalStorageKeys.SPOILER_MODE_COVER, false),
      synopsis: useLocalStorage(LocalStorageKeys.SPOILER_MODE_SYNOPSIS, false),
    },
    theme: getTheme(),
    useDevSheet: isDevEnvironment,
    viewMode: useLocalStorage<ViewMode>(LocalStorageKeys.VIEW_MODE, 'grid'),
  }),
  actions: {
    updateBlurNsfw(blurNsfw: boolean) {
      this.blurNsfw = blurNsfw
    },

    updateGridMode(gridMode: GridMode) {
      this.gridMode = gridMode
    },

    updateSpoilerMode(spoilerMode: SpoilerMode) {
      this.spoilerMode.cover = spoilerMode.cover ?? this.spoilerMode.cover
      this.spoilerMode.synopsis
        = spoilerMode.synopsis ?? this.spoilerMode.synopsis
    },

    updateTheme(theme: Theme) {
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

    updateUseDevSheet(useDevSheet: boolean) {
      this.useDevSheet = useDevSheet
    },

    updateViewMode(viewMode: ViewMode) {
      this.viewMode = viewMode
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSettingsStore, import.meta.hot))
}
