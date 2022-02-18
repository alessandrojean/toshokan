import { computed, onMounted, onUnmounted, readonly, ref, watch } from 'vue'

import { useSettingsStore, THEME_SYSTEM, THEME_DARK } from '@/stores/settings'

export default function useDarkMode () {
  const settingsStore = useSettingsStore()

  const mediaDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches
  const theme = computed(() => settingsStore.theme)

  const darkMode = ref(
    (theme.value === THEME_SYSTEM && mediaDark) || theme.value === THEME_DARK
  )

  /**
   * @param {MediaQueryListEvent} event
   */
  function handleChange (event) {
    if (theme.value === 'system') {
      darkMode.value = event.matches
    }
  }

  if (window.matchMedia) {
    onMounted(() => {
      window.matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', handleChange)
    })

    onUnmounted(() => {
      window.matchMedia('(prefers-color-scheme: dark)')
        .removeEventListener('change', handleChange)
    })
  }

  watch(theme, newValue => {
    darkMode.value = newValue === THEME_DARK ||
      (
        newValue === THEME_SYSTEM &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      )
  })

  return {
    darkMode: readonly(darkMode)
  }
}
