<script lang="ts" setup>
import {
  ArrowLeftStartOnRectangleIcon,
  BuildingLibraryIcon,
} from '@heroicons/vue/20/solid'

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
      <RouterLink
        :to="{ name: 'index' }"
        class="inline-flex shrink-0 items-center rounded-md transition-shadow motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 dark:focus-visible:ring-offset-gray-900"
      >
        <span aria-hidden="true">
          <BuildingLibraryIcon class="h-9 w-9 text-primary-500" />
        </span>
        <span class="sr-only">{{ t('app.routes.home') }}</span>
        <span
          class="text-gray-800 dark:text-gray-200 font-display-safe font-semibold text-xl ml-3"
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
      </RouterLink>
      <div class="inline-flex shrink-0 items-center">
        <Button
          v-if="authenticated && authorized"
          as="RouterLink"
          kind="primary"
          :to="{ name: 'dashboard' }"
          rounded
        >
          {{ t('home.header.dashboard') }}
        </Button>
        <ThemeToggle class="ml-3" light />
        <Button
          v-if="!authenticated"
          as="RouterLink"
          kind="primary"
          :to="{ name: 'dashboard' }"
          class="ml-3 hidden md:flex"
          rounded
        >
          {{ t('home.header.signIn') }}
        </Button>
        <Button
          v-if="!authenticated"
          as="RouterLink"
          kind="primary"
          :to="{ name: 'sign-in' }"
          class="ml-3 md:hidden"
          rounded
          icon-only
        >
          <span aria-hidden="true">
            <ArrowLeftStartOnRectangleIcon class="w-5 h-5 rotate-180" />
          </span>
          <span class="sr-only">
            {{ t('home.header.signIn') }}
          </span>
        </Button>
        <ProfileMenu v-if="authenticated" class="ml-3" light />
      </div>
    </div>
  </header>
</template>
