// https://javascript.plainenglish.io/how-to-create-a-debounced-ref-in-vue-3-using-composition-api-c464cc39c82a
import { ref, customRef } from 'vue'

function debounce(fn: (...args: any[]) => void, delay = 0, immediate = false) {
  let timeout: ReturnType<typeof setTimeout>
  return (...args: any[]) => {
    if (immediate && !timeout) fn(...args)
    clearTimeout(timeout)

    timeout = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}

function useDebouncedRef<T>(
  initialValue: T,
  delay: number,
  immediate: boolean
) {
  const state = ref(initialValue)
  const debouncedRef = customRef((track, trigger) => ({
    get() {
      track()
      return state.value
    },
    set: debounce(
      (value) => {
        state.value = value
        trigger()
      },
      delay,
      immediate
    )
  }))
  return debouncedRef
}

export default useDebouncedRef
