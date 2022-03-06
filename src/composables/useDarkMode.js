import { computed, readonly, ref, watch } from 'vue'
import { useMediaQuery } from '@vueuse/core'

import { useSettingsStore, THEME_SYSTEM, THEME_DARK } from '@/stores/settings'

export default function useDarkMode() {
  const settingsStore = useSettingsStore()

  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')

  const theme = computed(() => settingsStore.theme)

  const darkMode = ref(
    (theme.value === THEME_SYSTEM && prefersDark.value) ||
      theme.value === THEME_DARK
  )

  watch(prefersDark, (matches) => {
    if (theme.value === 'system') {
      darkMode.value = matches
    }
  })

  watch(theme, (newValue) => {
    darkMode.value =
      newValue === THEME_DARK ||
      (newValue === THEME_SYSTEM && prefersDark.value)
  })

  return {
    darkMode: readonly(darkMode)
  }
}
