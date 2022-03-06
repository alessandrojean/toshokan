<script setup>
import { nextTick, onMounted, provide, ref, watch } from 'vue'

import { useAuthStore } from '@/stores/auth'

import FadeTransition from '@/components/transitions/FadeTransition.vue'
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

const pageContents = ref(null)

function rebuildPageContents(resetPosition) {
  if (resetPosition) {
    handleHash()
  }

  pageContents.value?.buildPageContents(resetPosition)
}

provide('rebuildPageContents', rebuildPageContents)
provide('categoryOrder', ref(['guide', 'general']))
</script>

<template>
  <div>
    <PageHeader />
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 flex">
      <PageAside class="hidden md:block" />
      <router-view v-slot="{ Component, route }">
        <FadeTransition>
          <component :is="Component" :key="route.path" />
        </FadeTransition>
      </router-view>
      <PageContents class="hidden xl:block" ref="pageContents" />
    </div>
  </div>
</template>
