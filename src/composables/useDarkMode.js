import { computed, onMounted, onUnmounted, ref } from 'vue'

export default function useDarkMode () {
  const darkMode = ref(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)

  /**
   * @param {MediaQueryListEvent} event
   */
  function handleChange (event) {
    darkMode.value = event.matches
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

  return {
    darkMode: computed(() => darkMode.value)
  }
}
