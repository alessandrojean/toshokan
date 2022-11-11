<script lang="ts" setup>
export interface SimpleHeaderProps {
  loading?: boolean
  subtitle?: string
  title: string
}

withDefaults(defineProps<SimpleHeaderProps>(), {
  loading: false
})
</script>

<template>
  <header>
    <div class="max-w-7xl mx-auto px-4 sm:px-6">
      <div class="py-6 border-b dark:border-gray-700">
        <div v-if="loading" class="skeleton h-7 w-56"></div>
        <h1
          v-else
          class="text-xl lg:text-2xl font-display font-semibold text-gray-900 dark:text-gray-100"
        >
          {{ title }}
        </h1>
        <p class="text-gray-500 dark:text-gray-400" v-if="subtitle">
          {{ subtitle }}
        </p>
      </div>
    </div>
  </header>
</template>
