<template>
  <footer class="footer">
    <div>
      <label for="locale" class="sr-only">
        {{ t('dashboard.settings.appearence.locale.label') }}
      </label>
      <div class="relative group">
        <span aria-hidden="true" class="absolute inset-y-0 left-0 pl-3 flex items-center">
          <TranslateIcon class="w-5 h-5 text-gray-500 dark:text-gray-400 group-focus-within:text-gray-700 dark:group-focus-within:text-gray-200" />
        </span>
        <select
          class="select w-52 pl-10 h-auto"
          id="locale"
          v-model="locale"
        >
          <option
            v-for="loc in availableLocales"
            :key="loc"
            :value="loc"
          >
            {{ t('app.localeName', null, { locale: loc }) }}
          </option>
        </select>
      </div>
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
        (<a :href="gitHubUrl" target="_blank">{{ gitHash }}</a>)
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

import useAppInfo from '@/composables/useAppInfo'

import { TranslateIcon } from '@heroicons/vue/solid'

export default {
  components: { TranslateIcon },

  setup () {
    const { appVersion, gitHash, gitHubUrl } = useAppInfo()

    const isDev = ref(process.env.NODE_ENV === 'development')

    const { t, locale, availableLocales } = useI18n({ useScope: 'global' })

    return {
      appVersion,
      gitHash,
      gitHubUrl,
      isDev,
      t,
      locale,
      availableLocales
    }
  }
}
</script>

<style scoped>
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
  @apply hover:underline hover:text-gray-600 dark:hover:text-gray-300 motion-safe:transition-shadow rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 dark:focus-visible:ring-offset-gray-900 focus-visible:ring-indigo-500;
}
</style>
