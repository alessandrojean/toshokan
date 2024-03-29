<script lang="ts" setup>
import type { RouteLocationRaw } from 'vue-router'

import { BuildingLibraryIcon, CameraIcon } from '@heroicons/vue/20/solid'

import libraryUnsplash from '@/assets/library-unsplash.jpg'

const authStore = useAuthStore()
const router = useRouter()

const { appVersion } = useAppInfo()

const authenticated = computed(() => authStore.authenticated)
const authorized = computed(() => authStore.authorized)
const shouldRedirect = computed(() => authenticated.value && authorized.value)

function redirectToDashboard() {
  if (shouldRedirect.value) {
    router.replace({ name: 'dashboard' })
  }
}

onMounted(redirectToDashboard)

watch(shouldRedirect, redirectToDashboard)

const { t, locale } = useI18n({ useScope: 'global' })

const steps = computed(() => [
  t('signIn.step1'),
  t('signIn.step2'),
  t('signIn.step3'),
])

interface Link {
  href: string
  text: string
}

const baseUrl = computed(() => {
  const localePath = locale.value === 'pt-BR' ? '/pt' : ''
  return 'https://alessandrojean.github.io/toshokan' + localePath
})

const links = computed<Link[]>(() => [
  { href: `${baseUrl.value}/general/accessibility`, text: t('footer.links.a11y') },
  { href: `${baseUrl.value}/guides/instructions`, text: t('footer.links.instructions') },
  {
    href: `${baseUrl.value}/general/privacy-policy`,
    text: t('footer.links.privacyPolicy'),
  },
  { href: `${baseUrl.value}/general/terms-of-use`, text: t('footer.links.termsOfUse') },
])

const showOverlay = ref(false)

function handleNotification(
  notification: google.accounts.id.PromptMomentNotification,
) {
  const notificationShowing
    = notification.isDisplayMoment() && notification.isDisplayed()
  showOverlay.value = notificationShowing // || !authorized.value
}

watch(authorized, (isAuthorized) => {
  showOverlay.value = !isAuthorized
})

const { darkMode } = useDarkMode()
</script>

<route lang="yaml">
meta:
  title: app.routes.signIn
</route>

<template>
  <main
    id="main-content"
    role="main"
    class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div
      class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden md:grid md:grid-cols-2 max-w-[370px] md:max-w-3xl w-full"
    >
      <div
        class="bg-cover aspect-w-4 aspect-h-5 hidden md:block"
        :style="{
          backgroundImage: `url('${libraryUnsplash}')`,
        }"
      >
        <div
          class="flex flex-col bg-gradient-to-br from-primary-900/80 to-primary-500/80"
        >
          <header class="p-4">
            <RouterLink
              :to="{ name: 'index' }"
              class="flex items-center rounded-md w-fit has-ring-focus focus-visible:ring-white focus-visible:ring-offset-primary-700"
              :title="t('app.routes.home')"
            >
              <span aria-hidden="true">
                <BuildingLibraryIcon class="h-9 w-9 mx-auto text-white/90" />
              </span>
              <span
                class="text-white/90 font-display-safe font-semibold text-xl ml-3"
                aria-hidden="true"
              >
                {{ t('app.name') }}
              </span>
              <sup
                class="text-white/90 font-semibold text-[0.6rem] align-super ml-0.5"
                aria-hidden="true"
              >
                BETA
              </sup>
            </RouterLink>
          </header>

          <div class="flex justify-between mt-auto pb-4 px-4">
            <p class="text-white/80 text-xs">
              <span aria-hidden="true" class="inline-block align-text-bottom">
                <CameraIcon class="w-4 h-4 mr-2" />
              </span>
              <a
                target="_blank"
                href="https://unsplash.com/@itfeelslikefilm?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
                class="hocus:underline hocus:text-white/90 has-ring-focus focus-visible:ring-offset-primary-700 focus-visible:ring-white rounded"
              >Janko Ferlič</a>
            </p>
            <p class="text-white/80 text-xs">
              {{ t('footer.version', { version: appVersion }) }}
            </p>
          </div>
        </div>
      </div>
      <div class="py-4 px-5 flex flex-col">
        <h1
          class="font-display-safe text-2xl font-bold text-gray-900 dark:text-gray-100"
        >
          {{ t('signIn.title') }}
          <span class="sr-only">{{ t('signIn.titleSr') }}</span>
        </h1>
        <p aria-hidden="true" class="text-sm text-gray-600 dark:text-gray-300">
          {{ t('signIn.subTitle') }}
        </p>

        <SignInWithGoogleButton
          class="mt-6"
          type="standard"
          @notification="handleNotification"
        />

        <FadeTransition>
          <p v-if="authenticated" class="flex items-center font-medium mt-6">
            <span aria-hidden="true" class="inline-block mr-2.5">
              <LoadingSpinIcon
                class="w-5 h-5 text-primary-600 dark:text-primary-400 motion-safe:animate-spin"
              />
            </span>

            <span v-if="!authorized">{{ t('auth.authorizing') }}</span>
            <span v-else>{{ t('auth.redirecting') }}</span>
          </p>
        </FadeTransition>

        <ul class="py-8 space-y-4">
          <li
            v-for="(step, idx) in steps"
            :key="idx"
            :class="idx === 1 ? 'items-start' : 'items-center'"
            class="flex"
          >
            <div
              class="font-display-safe font-semibold text-xs bg-primary-100 dark:bg-gray-700 text-primary-700 dark:text-gray-300 w-6 h-6 rounded-full flex items-center justify-center"
            >
              {{ idx + 1 }}
            </div>
            <div class="flex flex-col ml-3 mt-0.5">
              <span class="text-sm font-medium dark:text-gray-200">
                {{ step }}
              </span>
              <span
                v-if="idx === 1"
                class="text-xs text-gray-600 dark:text-gray-400 mt-0.5"
              >
                {{ t('signIn.enablePopups') }}
              </span>
            </div>
          </li>
        </ul>

        <footer
          role="contentinfo"
          class="mt-auto -mx-5 px-5 pt-4 border-t dark:border-t-gray-600"
        >
          <nav
            role="navigation"
            aria-label="Links úteis"
            class="text-xs flex justify-between items-center relative"
          >
            <ul class="flex flex-wrap pr-8">
              <li v-for="(link, i) of links" :key="i">
                <a :href="link.href" target="_blank" class="utility-link mr-2 mb-2">
                  {{ link.text }}
                </a>
              </li>
            </ul>
            <ThemeToggle class="shrink-0 -mr-1" bottom :light="!darkMode" />
          </nav>
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
