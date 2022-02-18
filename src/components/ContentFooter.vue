<template>
  <footer class="content-footer">
    <p>{{ t('footer.version', { version: appVersion }) }}</p>
    <p>{{ t('footer.lastUpdate', [d(date, 'long')]) }}</p>
  </footer>
</template>

<script>
import useAppInfo from '@/composables/useAppInfo'
import { useI18n } from 'vue-i18n'

export default {
  props: {
    date: {
      type: String,
      required: true
    }
  },

  setup () {
    const { appVersion } = useAppInfo()
    const { t, d } = useI18n({ useScope: 'global' })

    return { appVersion, t, d }
  }
}
</script>

<style lang="postcss" scoped>
.content-footer {
  @apply space-y-2 sm:space-y-0 text-center sm:text-left sm:flex sm:justify-between text-sm text-gray-500 dark:text-gray-400 border-t border-gray-300 dark:border-gray-600 pt-3 mt-10;
}
</style>
