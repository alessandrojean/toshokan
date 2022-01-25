<template>
 <main class="min-h-screen flex md:items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8" id="main-content">
    <div class="max-w-xl w-full">
      <header class="flex flex-col md:flex-row">
        <p class="font-semibold font-display text-4xl text-primary-600 dark:text-primary-500">
          404
        </p>
        <div>
          <div class="md:border-l md:border-gray-200 dark:md:border-gray-700 md:pl-6 md:ml-6">
            <h2 class="font-semibold font-display text-4xl dark:text-gray-100">
              {{ t('pageNotFound.title') }}
            </h2>
            <p class="mt-1 text-gray-500 dark:text-gray-400">
              {{ t('pageNotFound.description') }}
            </p>
          </div>
          <div class="mt-10 md:ml-6 md:pl-6">
            <router-link
              :to="{ name: signedIn ? 'DashboardHome' : 'Home' }"
              class="button is-primary"
            >
              <span aria-hidden="true">
                <HomeIcon />
              </span>
              {{ t('pageNotFound.goBack') }}
            </router-link>
          </div>
        </div>
      </header>
    </div>
  </main>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

import { HomeIcon } from '@heroicons/vue/solid'

export default {
  components: { HomeIcon },

  setup () {
    const store = useStore()
    const signedIn = computed(() => store.state.auth.signedIn)

    const { t } = useI18n()

    return { signedIn, t }
  }
}
</script>
