<template>
  <div>
    <transition
      leave-active-class="transition motion-reduce:transition-none duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
      enter-active-class="transition motion-reduce:transition-none duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
    >
      <div
        v-if="!authStarted"
        class="z-30 absolute w-full h-full flex justify-center items-center bg-opacity-90 bg-gray-100 dark:bg-gray-900"
      >
        <BookOpenIcon class="motion-safe:animate-pulse h-28 w-28 mx-auto text-indigo-500" aria-hidden="true" />
      </div>
    </transition>
    <router-view/>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

import { BookOpenIcon } from '@heroicons/vue/outline'

export default {
  components: {
    BookOpenIcon
  },

  setup () {
    const store = useStore()

    const authStarted = computed(() => store.state.auth.started)

    return {
      authStarted
    }
  }
}
</script>
