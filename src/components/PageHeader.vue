<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useAuthStore } from '@/stores/auth'

import { LibraryIcon } from '@heroicons/vue/solid'

import ProfileMenu from '@/components/ProfileMenu.vue'
import SignInWithGoogleButton from '@/components/SignInWithGoogleButton.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'

const { t } = useI18n({ useScope: 'global' })

const authStore = useAuthStore()
const authenticated = computed(() => authStore.authenticated)
const authorized = computed(() => authStore.authorized)
</script>

<template>
  <header
    class="z-50 h-16 select-none border-b border-gray-300 dark:border-gray-700 fixed top-0 inset-x-0 bg-white dark:bg-gray-900 supports-backdrop-blur:backdrop-blur-md supports-backdrop-blur:bg-opacity-90 dark:supports-backdrop-blur:bg-opacity-80"
  >
    <div
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-full"
    >
      <router-link
        :to="{ name: 'Home' }"
        class="inline-flex shrink-0 items-center rounded-md transition-shadow motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 dark:focus-visible:ring-offset-gray-900"
      >
        <span aria-hidden="true">
          <LibraryIcon class="h-9 w-9 text-primary-500" />
        </span>
        <span class="sr-only">{{ t('app.routes.home') }}</span>
        <span
          class="text-gray-800 dark:text-gray-200 font-display font-semibold text-xl ml-3"
          aria-hidden="true"
        >
          {{ t('app.name') }}
        </span>
        <sup
          class="text-gray-500 dark:text-gray-400 font-semibold text-[0.6rem] align-super ml-0.5"
          aria-hidden="true"
        >
          BETA
        </sup>
      </router-link>
      <div class="inline-flex shrink-0 items-center">
        <router-link
          :to="{ name: 'DashboardHome' }"
          class="button is-primary is-rounded"
          v-if="authenticated && authorized"
        >
          {{ t('home.header.dashboard') }}
        </router-link>
        <SignInWithGoogleButton :prompt="false" />
        <ThemeToggle class="ml-3" light />
        <ProfileMenu v-if="authenticated" class="ml-3" light hide-settings />
      </div>
    </div>
  </header>
</template>
