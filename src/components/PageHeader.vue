<template>
  <header class="h-16 select-none">
    <div class="max-w-prose mx-auto px-4 sm:px-6 lg:px-0 flex items-center justify-between h-full">
      <router-link
        :to="{ name: 'Home' }"
        class="inline-flex shrink-0 items-center rounded-md transition-shadow motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 dark:focus-visible:ring-offset-gray-900"
      >
        <span aria-hidden="true">
          <LibraryIcon class="h-9 w-9 text-primary-500" />
        </span>
        <span class="sr-only">{{ t('app.routes.home') }}</span>
        <span class="text-gray-800 dark:text-gray-200 font-display font-semibold text-xl ml-3" aria-hidden="true">
          {{ t('app.name') }}
        </span>
        <sup class="text-gray-500 dark:text-gray-400 font-semibold text-[0.6rem] align-super ml-0.5">
          BETA
        </sup>
      </router-link>
      <div class="inline-flex shrink-0">
        <ThemeToggle light />
        <router-link
          :to="{ name: 'DashboardHome' }"
          class="button is-primary is-rounded ml-3"
          v-if="signedIn"
        >
          {{ t('home.header.dashboard') }}
        </router-link>
      </div>
    </div>
  </header>
</template>

<script>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useAuthStore } from '@/stores/auth'

import { LibraryIcon } from '@heroicons/vue/solid'

import ThemeToggle from '@/components/ThemeToggle.vue'

export default {
  components: { LibraryIcon, ThemeToggle },

  setup () {
    const { t } = useI18n({ useScope: 'global' })

    const authStore = useAuthStore()
    const signedIn = computed(() => authStore.signedIn)

    return { t, signedIn }
  }
}
</script>
