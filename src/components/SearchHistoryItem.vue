<template>
  <a
    href="#"
    class="history-item group has-ring-focus"
    @click="$emit('click', search)"
  >
    <p class="flex-grow truncate min-w-0">
      {{ search }}
    </p>
    <button
      class="remove-button has-ring-focus"
      :title="t('dashboard.search.removeFromHistory')"
      @click.stop="$emit('click:remove', search)"
    >
      <span class="sr-only">
        {{ t('dashboard.search.removeFromHistory')}}
      </span>
      <span aria-hidden="true">
        <XIcon class="w-5 h-5" />
      </span>
    </button>
  </a>
</template>

<script>
import { useI18n } from 'vue-i18n'

import { XIcon } from '@heroicons/vue/solid'

export default {
  components: { XIcon },

  props: {
    search: {
      type: String,
      required: true
    }
  },

  emits: ['click', 'click:remove'],

  setup () {
    const { t } = useI18n()

    return { t }
  }
}
</script>

<style lang="postcss" scoped>
.history-item {
  @apply flex items-center relative
    text-sm sm:text-base
    text-gray-800 dark:text-gray-400
    bg-white dark:bg-gray-800
    pl-5 pr-10 py-3 sm:py-3.5 space-x-4;
}

.history-item:hover {
  @apply text-gray-800 dark:text-gray-300
    bg-gray-50 dark:bg-gray-700;
}

.history-item:focus-visible {
  @apply bg-gray-50 dark:bg-gray-700
    text-gray-800 dark:text-gray-300
    dark:ring-offset-gray-800 z-10;
}

.remove-button {
  @apply absolute right-3 p-1 rounded
    text-gray-400 dark:text-gray-500;
}

.history-item:focus-visible .remove-button,
.history-item:hover .remove-button {
  @apply text-gray-400 dark:text-gray-400;
}

.remove-button:hover,
.history-item:hover .remove-button:hover,
.remove-button:focus-visible {
  @apply text-gray-600 dark:text-gray-300;
}

.remove-button:focus-visible {
  @apply dark:bg-gray-800 dark:ring-offset-gray-800;
}
</style>
