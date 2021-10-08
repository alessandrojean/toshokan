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

<style>
.history-item {
  @apply flex items-center relative
    text-gray-800 dark:text-gray-200
    bg-gray-50 dark:bg-gray-700
    px-4 py-4 sm:px-7 md:px-4
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
  @apply w-6 h-6 text-gray-500 dark:text-gray-400
    group-hover:text-primary-100 dark:group-hover:text-white
    group-focus-visible:text-primary-100 dark:group-focus-visible:text-white;
}

.remove-button {
  @apply absolute right-3 sm:right-6 md:right-3 p-1 rounded
    text-gray-500 dark:text-gray-400 group-hover:text-white
    group-focus-visible:text-white dark:focus-visible:text-white;
}

.remove-button:hover {
  @apply bg-primary-400 dark:bg-gray-500;
}
</style>
