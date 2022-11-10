<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useAuthStore } from '@/stores/auth'

import { ArrowLeftIcon } from '@heroicons/vue/20/solid'
import Button from '@/components/form/Button.vue'

const authStore = useAuthStore()
const authenticated = computed(() => authStore.authenticated)
const authorized = computed(() => authStore.authorized)

const { t } = useI18n({ useScope: 'global' })
</script>

<route lang="yaml">
meta:
  title: app.routes.notFound
</route>

<template>
  <main
    class="min-h-screen flex md:items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8"
    id="main-content"
  >
    <div class="max-w-xl w-full">
      <header class="flex flex-col md:flex-row">
        <p
          class="font-semibold font-display text-4xl text-primary-600 dark:text-primary-500"
        >
          404
        </p>
        <div>
          <div
            class="md:border-l md:border-gray-200 dark:md:border-gray-700 md:pl-6 md:ml-6"
          >
            <h2 class="font-semibold font-display text-4xl dark:text-gray-100">
              {{ t('pageNotFound.title') }}
            </h2>
            <p class="mt-1 text-gray-500 dark:text-gray-400">
              {{ t('pageNotFound.description') }}
            </p>
          </div>
          <div class="mt-10 md:ml-6 md:pl-6">
            <Button
              as="RouterLink"
              kind="ghost"
              link
              :to="{
                name: authenticated && authorized ? 'dashboard' : 'Home'
              }"
              class="-ml-3 group"
            >
              <template #left="{ iconClass }">
                <ArrowLeftIcon
                  :class="[
                    iconClass,
                    'motion-safe:transition-transform group-hover:-translate-x-1'
                  ]"
                />
              </template>
              <span>
                {{
                  t(
                    authenticated && authorized
                      ? 'pageNotFound.goBackDashboard'
                      : 'pageNotFound.goBack'
                  )
                }}
              </span>
            </Button>
          </div>
        </div>
      </header>
    </div>
  </main>
</template>
