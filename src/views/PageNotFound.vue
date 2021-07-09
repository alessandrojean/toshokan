<template>
 <main class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8" id="main-content">
    <div class="max-w-sm w-full space-y-8">
      <header>
        <span aria-hidden="true">
          <ExclamationCircleIcon class="h-12 w-12 mx-auto text-red-500" aria-hidden="true" />
        </span>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-200">
          {{ t('pageNotFound.title') }}
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          {{ t('pageNotFound.description') }}
        </p>
      </header>
      <div class="w-full flex justify-center">
        <router-link
          :to="{ name: signedIn ? 'DashboardHome' : 'Home' }"
          class="button is-primary text-lg"
        >
          <span aria-hidden="true">
            <HomeIcon />
          </span>
          {{ t('pageNotFound.goBack') }}
        </router-link>
      </div>
      <footer class="mt-8 space-y-8 flex flex-col items-center">
        <p class="font-mono text-gray-400 text-xs dark:text-gray-500">
          {{ t('footer.version', { version: appVersion }) }}
          (<a :href="gitHubUrl" target="_blank" class="hover:text-indigo-500 hover:underline dark:hover:text-gray-200">{{ gitHash }}</a>)
        </p>
      </footer>
    </div>
  </main>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

import useAppInfo from '@/composables/useAppInfo'

import { HomeIcon } from '@heroicons/vue/solid'
import { ExclamationCircleIcon } from '@heroicons/vue/outline'

export default {
  name: 'Error',

  components: {
    ExclamationCircleIcon,
    HomeIcon
  },

  setup () {
    const { appVersion, gitHash, gitHubUrl } = useAppInfo()

    const store = useStore()
    const signedIn = computed(() => store.state.auth.signedIn)

    const { t } = useI18n()

    return {
      appVersion,
      gitHash,
      gitHubUrl,
      signedIn,
      t
    }
  }
}
</script>
