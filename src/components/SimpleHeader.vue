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
  <header class="bg-white shadow dark:bg-gray-800">
    <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
      <div v-if="loading" class="skeleton h-7 w-56"></div>
      <h1
        v-else
        class="text-xl font-display font-semibold text-gray-900 dark:text-gray-100"
      >
        {{ title }}
      </h1>
      <p class="text-gray-500 dark:text-gray-400" v-if="subtitle">
        {{ subtitle }}
      </p>
    </div>
  </header>
</template>
