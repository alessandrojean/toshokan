<script setup>
import { useI18n } from 'vue-i18n'

defineProps({ date: String })

const { t, d } = useI18n()
</script>

<template>
  <div class="content-title">
    <h1>
      <slot></slot>
    </h1>

    <time
      v-if="date"
      :datetime="date"
      class="text-sm text-gray-600 dark:text-gray-400"
    >
      {{ t('footer.lastUpdate', [d(date, 'long')]) }}
    </time>
  </div>
</template>

<style lang="postcss" scoped>
.content-title {
  @apply py-20 md:pb-10 md:pt-12;
}

.content-title h1 {
  @apply font-display font-bold leading-7
    text-3xl md:text-4xl
    text-gray-800 dark:text-gray-100;
}
</style>
