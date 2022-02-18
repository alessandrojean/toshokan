<template>
  <div>
    <PageHeader />
    <router-view v-slot="{ Component }">
      <transition
        mode="out-in"
        enter-active-class="transition motion-reduce:transition-none duration-500 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100 "
        leave-active-class="transition motion-reduce:transition-none duration-300 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script>
import { nextTick, onMounted, watch } from 'vue'

import { useAuthStore } from '@/stores/auth'

import PageHeader from '@/components/PageHeader.vue'

export default {
  components: { PageHeader },

  setup () {
    const authStore = useAuthStore()

    watch(() => authStore.started, async () => await handleHash())
    onMounted(async () => await handleHash())

    async function handleHash () {
      if (window.location.hash && authStore.started) {
        await nextTick()
        await nextTick()

        document.querySelector(window.location.hash)
          ?.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }
}
</script>
