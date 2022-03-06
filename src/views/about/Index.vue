<script setup>
import { nextTick, onMounted, watch } from 'vue'

import { useAuthStore } from '@/stores/auth'

import PageAside from '@/components/PageAside.vue'
import PageContents from '@/components/PageContents.vue'
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
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 flex">
      <PageAside class="hidden lg:block" />
      <router-view />
      <PageContents class="hidden lg:block" />
    </div>
  </div>
</template>
