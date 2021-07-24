import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useStore } from 'vuex'

export default function useDarkMode () {
  const store = useStore()

  const mediaDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  const theme = computed(() => store.state.theme)

  const darkMode = ref((theme.value === 'system' && mediaDark) || theme.value === 'dark')

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
    darkMode.value = newValue === 'dark' || (newValue === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  })

  return {
    darkMode: computed(() => darkMode.value)
  }
}
