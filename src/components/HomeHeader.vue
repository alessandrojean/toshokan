<script lang="ts" setup>
import { BuildingLibraryIcon } from '@heroicons/vue/20/solid'
import { ArrowLeftStartOnRectangleIcon } from '@heroicons/vue/24/solid'

const authStore = useAuthStore()
const authenticated = computed(() => authStore.authenticated)
const authorized = computed(() => authStore.authorized)

const { t } = useI18n({ useScope: 'global' })
</script>

<template>
  <header class="w-full select-none">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <h1 class="flex items-center rounded-md">
          <span aria-hidden="true">
            <BuildingLibraryIcon class="h-9 w-9 text-primary-500" />
          </span>
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
        </h1>
        <div class="flex-1 hidden md:block md:ml-6">
          <Button as="RouterLink" kind="ghost" to="/help/guide/instructions">
            {{ t('home.header.instructions') }}
          </Button>
        </div>
        <div class="flex items-center">
          <Button
            as="RouterLink"
            kind="primary"
            :to="{ name: 'dashboard' }"
            rounded
            v-if="authenticated && authorized"
          >
            {{ t('home.header.dashboard') }}
          </Button>
          <ThemeToggle light class="ml-3" />
          <Button
            as="RouterLink"
            kind="primary"
            :to="{ name: 'dashboard' }"
            rounded
            class="ml-3 hidden md:flex"
            v-if="!authenticated"
          >
            {{ t('home.header.signIn') }}
          </Button>
          <Button
            as="RouterLink"
            kind="primary"
            size="large"
            :to="{ name: 'sign-in' }"
            :aria-label="t('home.header.signIn')"
            rounded
            icon-only
            class="ml-3 md:hidden"
            v-if="!authenticated"
            v-slot="{ iconClass }"
          >
            <ArrowLeftStartOnRectangleIcon :class="[iconClass, 'rotate-180']" />
          </Button>
          <ProfileMenu v-if="authenticated" class="ml-3" light />
        </div>
      </div>
    </div>
  </header>
</template>
