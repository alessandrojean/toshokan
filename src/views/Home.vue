<template>
  <div class="bg-gray-50 dark:bg-gray-900">
    <HomeHeader />

    <main class="max-w-7xl mx-auto pb-16 px-6 lg:px-8 space-y-16" id="main-content">
      <section class="w-full">
        <div class="flex flex-col items-center pt-24 space-y-24">
          <div class="space-y-8">
            <h2 class="text-gray-800 dark:text-gray-100 font-bold font-title text-center text-5xl">
              {{ t('home.leading1') }}<br>
              <span class="text-indigo-600 dark:text-indigo-500">
                {{ t('home.leading2') }}
              </span>
            </h2>
            <p class="w-full text-gray-500 dark:text-gray-400 text-center max-w-2xl text-lg">
              {{ t('home.shortDescription') }}
            </p>
          </div>
          <figure class="w-full flex justify-center">
            <img class="border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg" src="@/assets/home/screenshot-library.png" alt="">
          </figure>
        </div>
      </section>

      <section class="features">
        <h2>{{ t('home.features.title') }}</h2>

        <div class="features-grid">
          <div class="feature">
            <span class="icon" aria-hidden="true">
              <SearchIcon />
            </span>
            <h3>{{ t('home.features.isbn.title') }}</h3>
            <p>{{ t('home.features.isbn.description') }}</p>
          </div>

          <div class="feature">
            <span class="icon" aria-hidden="true">
              <PhotographIcon />
            </span>
            <h3>{{ t('home.features.cover.title') }}</h3>
            <p>{{ t('home.features.cover.description') }}</p>
          </div>

          <div class="feature">
            <span class="icon" aria-hidden="true">
              <SparklesIcon />
            </span>
            <h3>{{ t('home.features.data.title') }}</h3>
            <p>{{ t('home.features.data.description') }}</p>
          </div>

          <div class="feature">
            <span class="icon" aria-hidden="true">
              <ChipIcon />
            </span>
            <h3>{{ t('home.features.openSource.title') }}</h3>
            <p>{{ t('home.features.openSource.description') }}</p>
          </div>
        </div>
      </section>

      <section class="functionality">
        <figure>
          <img src="@/assets/home/screenshot-metadata.png" alt="">
        </figure>

        <div class="functionality-description">
          <span class="icon" aria-hidden="true">
            <DatabaseIcon />
          </span>
          <h2>
            {{ t('home.collection.title') }}
          </h2>
          <p>{{ t('home.collection.description').split('\n\n')[0] }}</p>
          <p>{{ t('home.collection.description').split('\n\n')[1] }}</p>
        </div>
      </section>

      <section class="cta">
        <h2>{{ t('home.cta.title') }}</h2>
        <div class="button-wrapper">
          <router-link
            :to="{ name: 'DashboardHome' }"
            class="button is-primary"
            v-if="signedIn"
          >
            {{ t('home.cta.dashboard') }}
          </router-link>
          <SignInWithGoogleButton class="is-cta" />
          <router-link
            :to="{ name: 'Instructions' }"
            class="button is-secondary"
          >
            {{ t('home.cta.instructions') }}
          </router-link>
        </div>
      </section>
    </main>

    <HomeFooter />
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

import {
  ChipIcon,
  DatabaseIcon,
  PhotographIcon,
  SearchIcon,
  SparklesIcon
} from '@heroicons/vue/outline'

import HomeFooter from '@/components/HomeFooter'
import HomeHeader from '@/components/HomeHeader'
import SignInWithGoogleButton from '@/components/SignInWithGoogleButton'

export default {
  components: {
    HomeFooter,
    HomeHeader,
    SignInWithGoogleButton,
    ChipIcon,
    DatabaseIcon,
    PhotographIcon,
    SearchIcon,
    SparklesIcon
  },

  setup () {
    const store = useStore()
    const signedIn = computed(() => store.state.auth.signedIn)

    const { t } = useI18n()

    return { signedIn, t }
  }
}
</script>

<style scoped>
.features {
  @apply grid grid-cols-3 gap-12 py-6;
}

.features h2 {
  @apply col-span-3 md:col-span-1 text-gray-800 dark:text-gray-100 font-title font-bold text-3xl;
}

.features-grid {
  @apply col-span-3 md:col-span-2 inline-grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-2 gap-12;
}

.feature {
  @apply space-y-4;
}

.feature h3 {
  @apply text-gray-800 dark:text-gray-100 font-semibold font-title text-lg;
}

.feature p {
  @apply text-gray-500 dark:text-gray-400;
}

.functionality-description .icon,
.feature .icon {
  @apply w-12 h-12 bg-indigo-500 inline-flex justify-center items-center rounded-md;
}

.functionality-description .icon svg,
.feature .icon svg {
  @apply w-6 h-6 text-white;
}

.functionality {
  @apply py-6 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-10 overflow-x-hidden;
}

.functionality-description {
  @apply flex flex-col space-y-4 justify-center row-start-1 row-end-2 md:row-auto;
}

.functionality-description .icon {
  @apply hidden lg:flex;
}

.functionality-description h2 {
  @apply text-gray-800 dark:text-gray-100 font-title font-bold text-2xl;
}

.functionality-description p {
  @apply text-gray-500 dark:text-gray-400;
}

.functionality figure {
  @apply px-6 md:pl-0 md:pr-8;
}

.functionality figure img {
  @apply shadow-lg rounded-lg border border-gray-200 dark:border-gray-600;
}

.cta {
  @apply flex flex-col items-center space-y-6;
}

.cta h2 {
  @apply col-span-3 md:col-span-1 text-gray-800 dark:text-gray-100 font-title font-bold text-3xl text-center;
}

.cta .button-wrapper {
  @apply flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4;
}

.cta .button {
  @apply py-3 px-5 font-medium text-base shadow-md justify-center;
}

.cta .button.is-secondary {
  @apply text-indigo-500 dark:text-gray-100;
}
</style>
