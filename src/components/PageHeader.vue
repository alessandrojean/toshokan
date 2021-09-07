<template>
  <header class="h-16">
    <div class="max-w-prose mx-auto px-4 sm:px-6 lg:px-0 flex items-center h-full">
      <router-link
        :to="{ name: 'Home' }"
        class="flex items-center rounded-md transition-shadow motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 dark:focus-visible:ring-offset-gray-900"
      >
        <span aria-hidden="true">
          <LibraryIcon class="h-9 w-9 text-primary-500" />
        </span>
        <span class="sr-only">{{ t('app.routes.home') }}</span>
        <span class="text-gray-800 dark:text-gray-200 font-display font-semibold text-xl ml-3" aria-hidden="true">
          {{ t('app.name') }}
        </span>
      </router-link>
    </div>
  </header>
</template>

<script>
import { useI18n } from 'vue-i18n'

import { LibraryIcon } from '@heroicons/vue/solid'

export default {
  components: { LibraryIcon },

  setup () {
    const { t } = useI18n()

    return { t }
  }
}
</script>
