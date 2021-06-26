<template>
  <header class="bg-white shadow dark:bg-gray-800">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div v-if="loading" class="animate-pulse h-8 bg-gray-400 dark:bg-gray-600 rounded w-56"></div>
      <h1 v-else class="text-3xl font-title font-semibold text-gray-900 dark:text-gray-100">
        {{ title }}
      </h1>
    </div>
  </header>
</template>

<script>
export default {
  name: 'SimpleHeader',

  props: {
    loading: Boolean,
    title: {
      type: String,
      required: true
    }
  }
}
</script>
