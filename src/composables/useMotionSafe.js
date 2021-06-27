import { computed, onMounted, onUnmounted, ref } from 'vue'

export default function useMotionSafe () {
  const motionSafe = ref(window.matchMedia && window.matchMedia('(prefers-reduced-motion: no-preference)').matches)

  function handleChange (e) {
    motionSafe.value = e.matches
  }

  if (window.matchMedia) {
    onMounted(() => {
      window.matchMedia('(prefers-reduced-motion: no-preference)')
        .addEventListener('change', handleChange)
    })

    onUnmounted(() => {
      window.matchMedia('(prefers-reduced-motion: no-preference)')
        .removeEventListener('change', handleChange)
    })
  }

  return {
    motionSafe: computed(() => motionSafe.value)
  }
}
