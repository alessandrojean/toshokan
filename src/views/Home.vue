<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useAuthStore } from '@/stores/auth'

import {
  CodeIcon,
  DatabaseIcon,
  PhotographIcon,
  SearchIcon,
  SparklesIcon
} from '@heroicons/vue/outline'

import HomeFooter from '@/components/HomeFooter.vue'
import HomeHeader from '@/components/HomeHeader.vue'
import SignInWithGoogleButton from '@/components/SignInWithGoogleButton.vue'
import Typewriter from '@/components/Typewriter.vue'

const authStore = useAuthStore()
const authenticated = computed(() => authStore.authenticated)
const authorized = computed(() => authStore.authorized)

const { t } = useI18n({ useScope: 'global' })

const features = computed(() => [
  {
    icon: SearchIcon,
    title: t('home.features.isbn.title'),
    description: t('home.features.isbn.description')
  },
  {
    icon: PhotographIcon,
    title: t('home.features.cover.title'),
    description: t('home.features.cover.description')
  },
  {
    icon: SparklesIcon,
    title: t('home.features.data.title'),
    description: t('home.features.data.description')
  },
  {
    icon: CodeIcon,
    title: t('home.features.openSource.title'),
    description: t('home.features.openSource.description')
  }
])
</script>

<template>
  <div class="bg-gray-50 dark:bg-gray-900">
    <HomeHeader />

    <main
      class="max-w-7xl mx-auto pb-16 px-6 lg:px-8 space-y-16"
      id="main-content"
    >
      <section class="w-full">
        <div class="flex flex-col items-center pt-24 space-y-24">
          <div class="space-y-8">
            <h2
              class="text-gray-800 dark:text-gray-100 font-bold font-display text-center text-5xl"
            >
              {{ t('home.leading1') + ' ' }}<br class="hidden md:block" />
              <i18n-t
                class="text-primary-600 dark:text-primary-500"
                keypath="home.leading2"
                tag="span"
                scope="global"
              >
                <Typewriter
                  :words="[
                    t('home.types.mangas'),
                    t('home.types.manhwas'),
                    t('home.types.manhuas'),
                    t('home.types.comics'),
                    t('home.types.books')
                  ]"
                  :next-word-interval="2000"
                  :delete-speed="100"
                  :speed="120"
                  text-class="underline decoration-primary-300 dark:decoration-primary-300/80 underline-offset-2"
                />
              </i18n-t>
            </h2>
            <p
              class="w-full text-gray-500 dark:text-gray-400 text-center max-w-2xl text-lg"
            >
              {{ t('home.shortDescription') }}
            </p>
          </div>
          <figure
            class="w-full flex flex-col justify-center border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg overflow-hidden"
          >
            <div
              aria-hidden="true"
              class="bg-gray-800 py-2.5 px-4 flex justify-between items-center"
            >
              <p
                class="text-sm text-gray-400 font-medium leading-tight select-none"
              >
                {{ t('app.name') }}
              </p>
              <div class="space-x-2 hidden md:flex">
                <span class="w-3.5 h-3.5 rounded-lg bg-gray-700 block"></span>
                <span class="w-3.5 h-3.5 rounded-lg bg-gray-700 block"></span>
                <span class="w-3.5 h-3.5 rounded-lg bg-gray-700 block"></span>
              </div>
            </div>
            <img
              class="md:hidden"
              src="@/assets/home/screenshot-library-mobile.jpg"
              alt=""
            />
            <img
              class="hidden md:block"
              src="@/assets/home/screenshot-dashboard.jpg"
              alt=""
            />
          </figure>
        </div>
      </section>

      <section class="features">
        <h2>{{ t('home.features.title') }}</h2>

        <div class="features-grid">
          <div v-for="feature in features" :key="feature.title" class="feature">
            <span class="icon" aria-hidden="true">
              <component :is="feature.icon" />
            </span>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </div>
      </section>

      <section class="functionality">
        <figure>
          <img src="@/assets/home/screenshot-metadata.jpg" alt="" />
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
            v-if="authenticated && authorized"
          >
            {{ t('home.cta.dashboard') }}
          </router-link>
          <SignInWithGoogleButton :prompt="false" />
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

<style lang="postcss" scoped>
.features {
  @apply grid grid-cols-3 gap-12 py-6;
}

.features h2 {
  @apply col-span-3 md:col-span-1 text-gray-800 dark:text-gray-100 font-display font-bold text-3xl;
}

.features-grid {
  @apply col-span-3 md:col-span-2 inline-grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-2 gap-12;
}

.feature {
  @apply space-y-4;
}

.feature h3 {
  @apply text-gray-800 dark:text-gray-100 font-semibold font-display text-lg;
}

.feature p {
  @apply text-gray-500 dark:text-gray-400;
}

.functionality-description .icon,
.feature .icon {
  @apply w-12 h-12 inline-flex justify-center items-center rounded-md
    bg-primary-100 dark:bg-gray-700;
}

.functionality-description .icon svg,
.feature .icon svg {
  @apply w-6 h-6 text-primary-600 dark:text-gray-400;
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
  @apply text-gray-800 dark:text-gray-100 font-display font-bold text-2xl;
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
  @apply col-span-3 md:col-span-1 text-gray-800 dark:text-gray-100 font-display font-bold text-3xl text-center;
}

.cta .button-wrapper {
  @apply flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4;
}

.cta .button {
  @apply py-2 px-5 font-medium rounded shadow-md justify-center;
}

.cta .button.is-secondary {
  @apply text-primary-600 dark:text-gray-100;
}

.cta .google-button {
  @apply shadow-md;
}
</style>
