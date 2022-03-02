import { onMounted, onUnmounted, readonly, ref } from 'vue'

export default function useMotionSafe() {
  const motionSafe = ref(
    window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: no-preference)').matches
  )

  /**
   * @param {MediaQueryListEvent} event
   */
  function handleChange(event) {
    motionSafe.value = event.matches
  }

  if (window.matchMedia) {
    onMounted(() => {
      window
        .matchMedia('(prefers-reduced-motion: no-preference)')
        .addEventListener('change', handleChange)
    })

    onUnmounted(() => {
      window
        .matchMedia('(prefers-reduced-motion: no-preference)')
        .removeEventListener('change', handleChange)
    })
  }

  return {
    motionSafe: readonly(motionSafe)
  }
}
