<template>
 <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-xs w-full space-y-8">
      <div>
        <ExclamationCircleIcon class="h-12 w-12 mx-auto text-red-500" aria-hidden="true" />
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-200">
          Erro crítico
        </h2>
        <p
          v-if="errorMessage && errorMessage.length > 0"
          class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400"
        >
          {{ errorMessage }}
        </p>
      </div>
      <div class="mt-8 space-y-8 flex flex-col items-center">
        <p class="font-mono text-gray-400 text-xs dark:text-gray-500">
          Toshokan v{{ appVersion }}
          (<a :href="gitHubUrl" target="_blank" class="hover:text-indigo-500 hover:underline dark:hover:text-gray-200">{{ gitHash }}</a>)
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { useRoute } from 'vue-router'

import { ExclamationCircleIcon } from '@heroicons/vue/outline'

import useAppInfo from '@/composables/useAppInfo'
import { computed } from '@vue/runtime-core'

export default {
  name: 'Error',

  components: {
    ExclamationCircleIcon
  },

  setup () {
    const route = useRoute()

    const { appVersion, gitHash, gitHubUrl } = useAppInfo()

    const errorMessage = computed(() => route.query.em)

    return {
      appVersion,
      gitHash,
      gitHubUrl,
      errorMessage
    }
  }
}
</script>
