<template>
  <a
    href="#"
    class="history-item group has-ring-focus"
    @click="$emit('click', search)"
  >
    <span aria-hidden="true" class="flex-shrink-0">
      <ClockIcon class="clock" />
    </span>
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
        <TrashIcon class="w-5 h-5" />
      </span>
    </button>
  </a>
</template>

<script>
import { useI18n } from 'vue-i18n'

import { ClockIcon } from '@heroicons/vue/outline'
import { TrashIcon } from '@heroicons/vue/solid'

export default {
  components: {
    ClockIcon,
    TrashIcon
  },

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
    text-gray-800 dark:text-gray-200
    bg-gray-50 dark:bg-gray-700
    pl-4 pr-10 py-3 sm:py-4
    space-x-4 rounded-md font-medium;
}

.history-item:hover {
  @apply text-white dark:text-gray-50
    bg-primary-500 dark:bg-gray-600;
}

.history-item:focus-visible {
  @apply bg-primary-500 text-white
    dark:ring-offset-gray-800;
}

.clock {
  @apply w-6 h-6 text-gray-500 dark:text-gray-400;
}

.history-item:focus-visible .clock,
.history-item:hover .clock {
  @apply text-primary-100 dark:text-white;
}

.remove-button {
  @apply absolute right-3 p-1 rounded
    text-gray-500 dark:text-gray-400;
}

.history-item:focus-visible .remove-button,
.history-item:hover .remove-button {
  @apply text-primary-100 dark:text-white;
}

.remove-button:hover,
.history-item:hover .remove-button:hover {
  @apply bg-primary-400 dark:bg-gray-500 text-white;
}
</style>
