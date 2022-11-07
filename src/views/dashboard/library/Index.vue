<script lang="ts" setup>
import FadeTransition from '@/components/transitions/FadeTransition.vue'
</script>

<template>
  <router-view v-slot="{ Component }">
    <FadeTransition>
      <component :is="Component" class="w-full" />
    </FadeTransition>
  </router-view>
</template>
