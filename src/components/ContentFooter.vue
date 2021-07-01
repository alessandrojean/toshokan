<template>
  <footer class="content-footer">
    <p>Toshokan v{{ appVersion }}</p>
    <p>Última atualização feita em {{ date }} às {{ time }}.</p>
  </footer>
</template>

<script>
import useAppInfo from '@/composables/useAppInfo'

export default {
  props: {
    date: {
      type: String,
      required: true
    },
    time: {
      type: String,
      required: true
    }
  },

  setup () {
    const { appVersion } = useAppInfo()

    return { appVersion }
  }
}
</script>

<style scoped>
.content-footer {
  @apply space-y-2 sm:space-y-0 text-center sm:text-left sm:flex sm:justify-between text-sm text-gray-500 dark:text-gray-400 border-t border-gray-300 dark:border-gray-600 pt-3 mt-10;
}
</style>
