<template>
  <footer class="footer">
    <div>
      <LocaleSelector v-model="locale" />
    </div>

    <nav>
      <ul>
        <li>
          <router-link :to="{ name: 'Accessibility' }">
            {{ t('footer.links.a11y') }}
          </router-link>
        </li>
        <li>
          <router-link :to="{ name: 'Instructions' }">
            {{ t('footer.links.instructions') }}
          </router-link>
        </li>
        <li>
          <router-link :to="{ name: 'PrivacyPolicy' }">
            {{ t('footer.links.privacyPolicy') }}
          </router-link>
        </li>
        <li>
          <router-link :to="{ name: 'TermsOfUse' }">
            {{ t('footer.links.termsOfUse' )}}
          </router-link>
        </li>
      </ul>
    </nav>

    <div class="text-center">
      <p>
        {{ t('footer.version', { version: appVersion }) }}
      </p>

      <p v-if="isDev">
        {{ t('footer.dev') }}
      </p>
    </div>
  </footer>
</template>

<script>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import LocaleSelector from '@/components/LocaleSelector.vue'

import useAppInfo from '@/composables/useAppInfo'

export default {
  components: { LocaleSelector },

  setup () {
    const { appVersion } = useAppInfo()

    const isDev = ref(import.meta.env.DEV)

    const { t, locale } = useI18n({ useScope: 'global' })

    return {
      appVersion,
      isDev,
      t,
      locale
    }
  }
}
</script>

<style lang="postcss" scoped>
.footer {
  @apply max-w-7xl mx-auto px-6 lg:px-8 flex flex-col items-center space-y-6 py-8 text-sm;
}

.footer nav ul {
  @apply flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-8 font-medium text-gray-500 dark:text-gray-400 text-center;
}

.footer p {
  @apply text-gray-400;
}

.footer a {
  @apply hover:underline hover:text-gray-600 dark:hover:text-gray-300 motion-safe:transition-shadow rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 dark:focus-visible:ring-offset-gray-900 focus-visible:ring-primary-500;
}
</style>
