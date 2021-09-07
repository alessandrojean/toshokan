<template>
  <header class="bg-white shadow dark:bg-gray-800">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div v-if="loading" class="motion-safe:animate-pulse h-8 bg-gray-400 dark:bg-gray-600 rounded w-56"></div>
      <h1 v-else class="text-2xl md:text-3xl font-display font-semibold text-gray-900 dark:text-gray-100">
        {{ title }}
      </h1>
      <p class="text-gray-500 dark:text-gray-400" v-if="subtitle">
        {{ subtitle }}
      </p>
    </div>
  </header>
</template>

<script>
export default {
  name: 'SimpleHeader',

  props: {
    loading: Boolean,
    subtitle: String,
    title: {
      type: String,
      required: true
    }
  }
}
</script>
