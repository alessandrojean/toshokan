<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import useAppInfo from '@/composables/useAppInfo'
import { useAuthStore } from '@/stores/auth'

import { LibraryIcon } from '@heroicons/vue/solid'

import FadeTransition from '@/components/transitions/FadeTransition.vue'
import LoadingSpinIcon from '@/components/icons/LoadingSpinIcon.vue'
import SignInWithGoogleButton from '@/components/SignInWithGoogleButton.vue'

const authStore = useAuthStore()
const router = useRouter()

const isDev = ref(import.meta.env.DEV)

const { appVersion } = useAppInfo()

const authenticated = computed(() => authStore.authenticated)
const authorized = computed(() => authStore.authorized)
const shouldRedirect = computed(() => authenticated.value && authorized.value)

const redirectToDashboard = () => {
  if (shouldRedirect.value) {
    router.replace({ name: 'DashboardHome' })
  }
}

onMounted(redirectToDashboard)

watch(shouldRedirect, redirectToDashboard)

const { t } = useI18n({ useScope: 'global' })

const links = computed(() => [
  { route: 'Accessibility', text: t('footer.links.a11y') },
  { route: 'Instructions', text: t('footer.links.instructions') },
  { route: 'PrivacyPolicy', text: t('footer.links.privacyPolicy') },
  { route: 'TermsOfUse', text: t('footer.links.termsOfUse') }
])

const showOverlay = ref(false)

function handleNotification(notification) {
  showOverlay.value =
    notification.isDisplayMoment() && notification.isDisplayed()
}
</script>

<template>
  <main
    role="main"
    class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8"
    id="main-content"
  >
    <div class="max-w-xs w-full space-y-8">
      <header>
        <RouterLink
          :to="{ name: 'Home' }"
          class="h-14 w-14 block mx-auto has-ring-focus dark:focus-visible:ring-offset-gray-900 rounded-md"
          :title="t('app.routes.home')"
        >
          <span aria-hidden="true">
            <LibraryIcon
              class="h-14 w-14 mx-auto text-primary-500"
              aria-hidden="true"
            />
          </span>
          <span class="sr-only">{{ t('app.routes.home') }}</span>
        </RouterLink>
        <h1
          class="mt-6 font-display text-center text-3xl font-bold text-gray-900 dark:text-gray-100"
        >
          {{ t('signIn.title') }}
          <span class="sr-only">{{ t('signIn.titleSr') }}</span>
        </h1>
        <p
          aria-hidden="true"
          class="mt-1 text-center text-sm text-gray-600 dark:text-gray-300"
        >
          {{ t('signIn.subTitle') }}
        </p>
      </header>
      <div class="mt-8 space-y-8 flex flex-col items-center">
        <SignInWithGoogleButton
          type="standard"
          @notification="handleNotification"
        />

        <FadeTransition>
          <p v-if="authenticated" class="flex items-center font-medium">
            <span aria-hidden="true" class="inline-block mr-2.5">
              <LoadingSpinIcon
                class="w-5 h-5 text-primary-600 dark:text-primary-400 motion-safe:animate-spin"
              />
            </span>

            <span v-if="!authorized">{{ t('auth.authorizing') }}</span>
            <span v-else>{{ t('auth.redirecting') }}</span>
          </p>
        </FadeTransition>

        <footer role="contentinfo">
          <nav role="navigation" aria-label="Links úteis" class="text-sm mb-6">
            <ul class="flex flex-col items-center space-y-1">
              <li v-for="link in links" :key="link.route">
                <router-link :to="{ name: link.route }" class="utility-link">
                  {{ link.text }}
                </router-link>
              </li>
            </ul>
          </nav>

          <p class="text-center text-gray-600 text-sm dark:text-gray-400">
            {{ t('footer.version', { version: appVersion }) }}
          </p>

          <p
            v-if="!isDev"
            class="text-center text-xs text-gray-600 dark:text-gray-500 mt-1"
            lang="en"
          >
            <a
              href="https://www.netlify.com/"
              target="_blank"
              class="rounded-sm hover:underline hover:text-primary-600 dark:hover:text-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 dark:focus-visible:ring-offset-gray-900 focus-visible:ring-primary-500"
              >This site is powered by Netlify</a
            >
            <img
              src="@/assets/netlify-logo.svg"
              alt="Netlify logo"
              class="h-3.5 w-3.5 inline-block align-text-bottom ml-1"
            />
          </p>

          <p
            v-else
            class="text-center text-xs text-gray-600 dark:text-gray-400 mt-1"
          >
            {{ t('footer.dev') }}
          </p>
        </footer>
      </div>
    </div>

    <FadeTransition>
      <div v-if="showOverlay" class="dialog-overlay" />
    </FadeTransition>
  </main>
</template>

<style lang="postcss" scoped>
.utility-link {
  @apply text-primary-500 dark:text-primary-400 font-semibold rounded-sm hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 dark:focus-visible:ring-offset-gray-900 focus-visible:ring-primary-500;
}
</style>
