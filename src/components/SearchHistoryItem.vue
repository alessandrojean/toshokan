<template>
  <a
    href="#"
    class="search-history-item relative group has-ring-focus"
    @click="$emit('click', search)"
  >
    <span aria-hidden="true">
      <ClockIcon class="w-6 h-6 text-gray-500 dark:text-gray-400 group-hover:text-primary-100 dark:group-hover:text-white group-focus-visible:text-primary-100 dark:group-focus-visible:text-white" />
    </span>
    <span class="flex-1 truncate">{{ search }}</span>
    <button
      class="absolute right-3 sm:right-6 md:right-3 p-1 rounded has-ring-focus text-gray-500 dark:text-gray-400 group-hover:text-white hover:bg-primary-400 dark:hover:bg-gray-500 group-focus-visible:text-white dark:focus-visible:text-white"
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

import { ClockIcon } from '@heroicons/vue/outline'
import { XIcon } from '@heroicons/vue/solid'

export default {
  components: {
    ClockIcon,
    XIcon
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
@layer components {
  .search-history-item {
    @apply flex items-center
      text-gray-800 dark:text-gray-200
      hover:text-white dark:hover:text-gray-50
      bg-gray-50 dark:bg-gray-700
      hover:bg-primary-500 dark:hover:bg-gray-600
      focus-visible:bg-primary-500
      focus-visible:text-white
      px-4 py-4 sm:px-7 md:px-4
      space-x-4 rounded-md font-medium
      dark:focus-visible:ring-offset-gray-800;
  }
}
</style>
