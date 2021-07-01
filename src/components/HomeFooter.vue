<template>
  <footer class="footer">
    <nav>
      <ul>
        <li>
          <router-link :to="{ name: 'Accessibility' }">
            Acessibilidade
          </router-link>
        </li>
        <li>
          <router-link :to="{ name: 'Instructions' }">
            Instruções de uso
          </router-link>
        </li>
        <li>
          <router-link :to="{ name: 'PrivacyPolicy' }">
            Política de Privacidade
          </router-link>
        </li>
        <li>
          <router-link :to="{ name: 'TermsOfUse' }">
            Termos de Uso
          </router-link>
        </li>
      </ul>
    </nav>

    <div class="text-center">
      <p>
        Toshokan v{{ appVersion }}
        (<a :href="gitHubUrl" target="_blank">{{ gitHash }}</a>)
      </p>

      <p v-if="isDev">
        Ambiente de desenvolvimento
      </p>
    </div>
  </footer>
</template>

<script>
import { ref } from 'vue'

import useAppInfo from '@/composables/useAppInfo'

export default {
  setup () {
    const { appVersion, gitHash, gitHubUrl } = useAppInfo()

    const isDev = ref(process.env.NODE_ENV === 'development')

    return {
      appVersion,
      gitHash,
      gitHubUrl,
      isDev
    }
  }
}
</script>

<style scoped>
.footer {
  @apply max-w-7xl mx-auto px-6 lg:px-8 flex flex-col items-center space-y-6 py-8 text-sm;
}

.footer nav ul {
  @apply flex space-x-8 font-medium text-gray-500 dark:text-gray-400;
}

.footer p {
  @apply text-gray-400;
}

.footer a {
  @apply hover:underline hover:text-gray-600 dark:hover:text-gray-300 motion-safe:transition-shadow rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 dark:focus-visible:ring-offset-gray-900 focus-visible:ring-indigo-500;
}
</style>
