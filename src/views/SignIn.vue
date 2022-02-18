<template>
 <main role="main" class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8" id="main-content">
    <div class="max-w-xs w-full space-y-8">
      <header>
        <span aria-hidden="true">
          <LibraryIcon class="h-14 w-14 mx-auto text-primary-500" aria-hidden="true" />
        </span>
        <h1 class="mt-6 font-display text-center text-3xl font-bold text-gray-900 dark:text-gray-100">
          {{ t('signIn.title') }}
          <span class="sr-only">{{ t('signIn.titleSr') }}</span>
        </h1>
        <p aria-hidden="true" class="mt-1 text-center text-sm text-gray-600 dark:text-gray-300">
          {{ t('signIn.subTitle') }}
        </p>
      </header>
      <div class="mt-8 space-y-8 flex flex-col items-center">
        <SignInWithGoogleButton class="is-large" />

        <footer role="contentinfo">
          <nav
            role="navigation"
            aria-label="Links úteis"
            class="text-sm mb-6"
          >
            <ul class="flex flex-col items-center space-y-1">
              <li>
                <router-link
                  :to="{ name: 'Accessibility' }"
                  class="utility-link"
                >
                  {{ t('footer.links.a11y') }}
                </router-link>
              </li>
              <li>
                <router-link
                  :to="{ name: 'Instructions' }"
                  class="utility-link"
                >
                  {{ t('footer.links.instructions') }}
                </router-link>
              </li>
              <li>
                <router-link
                  :to="{ name: 'PrivacyPolicy' }"
                  class="utility-link"
                >
                  {{ t('footer.links.privacyPolicy') }}
                </router-link>
              </li>
              <li>
                <router-link
                  :to="{ name: 'TermsOfUse' }"
                  class="utility-link"
                >
                  {{ t('footer.links.termsOfUse') }}
                </router-link>
              </li>
            </ul>
          </nav>

          <p class="text-center text-gray-600 text-sm dark:text-gray-400">
            {{ t('footer.version', { version: appVersion }) }}
          </p>

          <p v-if="!isDev" class="text-center text-xs text-gray-600 dark:text-gray-500 mt-1" lang="en">
            <a href="https://www.netlify.com/" target="_blank" class="rounded-sm hover:underline hover:text-primary-600 dark:hover:text-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 dark:focus-visible:ring-offset-gray-900 focus-visible:ring-primary-500">This site is powered by Netlify</a>
            <img src="@/assets/netlify-logo.svg" alt="Netlify logo" class="h-3.5 w-3.5 inline-block align-text-bottom ml-1"/>
          </p>

          <p v-else class="text-center text-xs text-gray-600 dark:text-gray-400 mt-1">
            {{ t('footer.dev') }}
          </p>
        </footer>
      </div>
    </div>
  </main>
</template>

<script>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import useAppInfo from '@/composables/useAppInfo'
import { useAuthStore } from '@/stores/auth'

import { LibraryIcon } from '@heroicons/vue/solid'

import SignInWithGoogleButton from '@/components/SignInWithGoogleButton.vue'

export default {
  name: 'Home',

  components: {
    LibraryIcon,
    SignInWithGoogleButton
  },

  setup () {
    const authStore = useAuthStore()
    const router = useRouter()

    const isDev = ref(import.meta.env.DEV)

    const { appVersion } = useAppInfo()

    const started = computed(() => authStore.started)
    const signedIn = computed(() => authStore.signedIn)

    const redirectToDashboard = () => {
      if (signedIn.value) {
        router.replace('/dashboard')
      }
    }

    onMounted(redirectToDashboard)

    watch(signedIn, redirectToDashboard)

    const { t } = useI18n({ useScope: 'global' })

    return {
      appVersion,
      isDev,
      started,
      signedIn,
      t
    }
  }
}
</script>

<style lang="postcss" scoped>
.utility-link {
  @apply text-primary-500 dark:text-primary-400 font-semibold rounded-sm hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 dark:focus-visible:ring-offset-gray-900 focus-visible:ring-primary-500;
}
</style>
