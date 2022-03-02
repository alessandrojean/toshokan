<script setup>
import { nextTick, onMounted, watch } from 'vue'

import { useAuthStore } from '@/stores/auth'

import FadeTransition from '@/components/transitions/FadeTransition.vue'
import PageHeader from '@/components/PageHeader.vue'

const authStore = useAuthStore()

watch(
  () => authStore.started,
  async () => await handleHash()
)
onMounted(async () => await handleHash())

async function handleHash() {
  if (window.location.hash && authStore.started) {
    await nextTick()
    await nextTick()

    document
      .querySelector(window.location.hash)
      ?.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <div>
    <PageHeader />
    <router-view v-slot="{ Component }">
      <FadeTransition>
        <component :is="Component" />
      </FadeTransition>
    </router-view>
  </div>
</template>
