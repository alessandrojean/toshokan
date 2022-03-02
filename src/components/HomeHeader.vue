<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useAuthStore } from '@/stores/auth'

import { LibraryIcon } from '@heroicons/vue/solid'

import ThemeToggle from '@/components/ThemeToggle.vue'
import SignInWithGoogleButton from '@/components/SignInWithGoogleButton.vue'

const authStore = useAuthStore()
const signedIn = computed(() => authStore.signedIn)

const { t } = useI18n({ useScope: 'global' })
</script>

<template>
  <header class="w-full select-none">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <h1 class="flex items-center rounded-md">
          <span aria-hidden="true">
            <LibraryIcon class="h-9 w-9 text-primary-500" />
          </span>
          <span
            class="text-gray-800 dark:text-gray-200 font-display font-semibold text-xl ml-3"
            aria-hidden="true"
          >
            {{ t('app.name') }}
          </span>
          <sup
            class="text-gray-500 dark:text-gray-400 font-semibold text-[0.6rem] align-super ml-0.5"
          >
            BETA
          </sup>
        </h1>
        <div class="flex-1 hidden md:block md:ml-6">
          <router-link :to="{ name: 'Instructions' }" class="button is-ghost">
            {{ t('home.header.instructions') }}
          </router-link>
        </div>
        <div class="flex items-center">
          <ThemeToggle light class="mr-3" />
          <router-link
            :to="{ name: 'DashboardHome' }"
            class="button is-primary is-rounded"
            v-if="signedIn"
          >
            {{ t('home.header.dashboard') }}
          </router-link>
          <SignInWithGoogleButton collapse />
        </div>
      </div>
    </div>
  </header>
</template>
