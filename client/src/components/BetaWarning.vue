<script lang="ts" setup>
import { MegaphoneIcon, XMarkIcon } from '@heroicons/vue/24/outline'

const LOCAL_STORAGE_KEY = 'hide_beta_warning'

const hideBetaWarning = useLocalStorage(LOCAL_STORAGE_KEY, false)

function handleDismiss() {
  hideBetaWarning.value = true
}

const { t } = useI18n({ useScope: 'global' })
</script>

<template>
  <FadeTransition>
    <div
      v-if="!hideBetaWarning"
      class="hidden md:block py-4 fixed bottom-0 inset-x-0 z-20"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          class="bg-primary-600 p-2.5 rounded-md shadow flex items-center justify-between flex-wrap"
        >
          <div class="w-0 flex-1 flex items-center">
            <span class="flex p-2 rounded-lg bg-primary-800">
              <MegaphoneIcon class="h-6 w-6 text-white" aria-hidden="true" />
            </span>
            <p class="ml-3 font-medium text-white truncate">
              <span class="md:hidden">
                {{ t('dashboard.home.beta.short') }}
              </span>
              <span class="hidden md:inline">
                {{ t('dashboard.home.beta.full') }}
              </span>
            </p>
          </div>
          <div class="shrink-0">
            <button
              type="button"
              class="flex p-2 rounded-md hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-white"
              @click.stop="handleDismiss"
            >
              <span class="sr-only">{{ t('dashboard.home.beta.close') }}</span>
              <XMarkIcon class="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </FadeTransition>
</template>
