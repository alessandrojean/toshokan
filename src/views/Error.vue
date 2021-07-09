<template>
  <main class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8" id="main-content">
    <div class="max-w-2xl w-full space-y-8">
      <header role="alert">
        <span aria-hidden="true">
          <ExclamationCircleIcon class="h-12 w-12 mx-auto text-red-500" aria-hidden="true" />
        </span>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-200">
          {{ t('criticalError.title') }}
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          {{ criticalError?.message || '' }}
        </p>
      </header>
      <div v-if="isDev" class="text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md py-4 px-6 w-full">
        <div class="w-full overflow-y-auto pb-2">
          <pre v-if="isDev"><code>{{ criticalError?.stack || '' }}</code></pre>
        </div>
      </div>
      <footer class="mt-8 flex flex-col items-center">
        <p class="text-center text-gray-600 text-sm dark:text-gray-500">
          {{ t('footer.version', { version: appVersion }) }}
          <span class="text-xs">(<a :href="gitHubUrl" target="_blank" class="rounded-sm font-mono hover:text-indigo-500 hover:underline dark:hover:text-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 dark:focus-visible:ring-offset-gray-900 focus-visible:ring-indigo-500">{{ gitHash }}</a>)</span>
        </p>

        <p v-if="isDev" class="text-center text-xs text-gray-600 dark:text-gray-500 mt-1">
          {{ t('footer.dev') }}
        </p>
      </footer>
    </div>
  </main>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

import useAppInfo from '@/composables/useAppInfo'

import { ExclamationCircleIcon } from '@heroicons/vue/outline'

export default {
  name: 'Error',

  components: {
    ExclamationCircleIcon
  },

  setup () {
    const router = useRouter()
    const store = useStore()

    const { appVersion, gitHash, gitHubUrl } = useAppInfo()

    const hasCriticalError = computed(() => store.getters.hasCriticalError)
    const criticalError = computed(() => store.state.criticalError)

    onMounted(() => {
      if (!hasCriticalError.value) {
        router.replace({ name: 'Home' })
      }
    })

    const isDev = ref(process.env.NODE_ENV === 'development')

    const { t } = useI18n()

    return {
      appVersion,
      gitHash,
      gitHubUrl,
      criticalError,
      isDev,
      t
    }
  }
}
</script>
