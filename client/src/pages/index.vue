<script lang="ts" setup>
import {
  CircleStackIcon,
  CodeBracketIcon,
  MagnifyingGlassIcon,
  PhotoIcon,
  SparklesIcon,
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const authenticated = computed(() => authStore.authenticated)
const authorized = computed(() => authStore.authorized)

const { t } = useI18n({ useScope: 'global' })

const features = computed(() => [
  {
    icon: MagnifyingGlassIcon,
    title: t('home.features.isbn.title'),
    description: t('home.features.isbn.description'),
  },
  {
    icon: PhotoIcon,
    title: t('home.features.cover.title'),
    description: t('home.features.cover.description'),
  },
  {
    icon: SparklesIcon,
    title: t('home.features.data.title'),
    description: t('home.features.data.description'),
  },
  {
    icon: CodeBracketIcon,
    title: t('home.features.openSource.title'),
    description: t('home.features.openSource.description'),
  },
])

const faqKeys = ref(['currentState', 'beta', 'costs', 'share', 'metadata'])
</script>

<route lang="yaml">
meta:
  title: app.routes.home
</route>

<template>
  <div class="bg-gray-50 dark:bg-gray-900">
    <HomeHeader />

    <main
      id="main-content"
      class="max-w-7xl mx-auto pb-16 px-6 lg:px-8 space-y-16"
    >
      <section class="w-full">
        <div class="flex flex-col items-center pt-24 space-y-24">
          <div class="space-y-8">
            <h2
              class="text-gray-800 dark:text-gray-100 font-bold font-display-safe text-center text-5xl"
            >
              {{ `${t('home.leading1')} ` }}<br class="hidden md:block">
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
                    t('home.types.books'),
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
                <span class="w-3.5 h-3.5 rounded-lg bg-gray-700 block" />
                <span class="w-3.5 h-3.5 rounded-lg bg-gray-700 block" />
                <span class="w-3.5 h-3.5 rounded-lg bg-gray-700 block" />
              </div>
            </div>
            <WireframeMobileLibrary class="md:hidden w-full h-full" />
            <WireframeDashboard class="hidden md:block w-full h-full" />
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
          <WireframeCreateBookDialog />
        </figure>

        <div class="functionality-description">
          <span class="icon" aria-hidden="true">
            <CircleStackIcon />
          </span>
          <h2>
            {{ t('home.collection.title') }}
          </h2>
          <p>{{ t('home.collection.description').split('\n\n')[0] }}</p>
          <p>{{ t('home.collection.description').split('\n\n')[1] }}</p>
        </div>
      </section>

      <section class="md:grid md:grid-cols-3 gap-12 py-12 lg:px-16">
        <div>
          <h2
            class="text-gray-800 dark:text-gray-100 font-display-safe font-bold text-2xl"
          >
            {{ t('home.faq.title') }}
          </h2>

          <p class="mt-2 text-gray-500 dark:text-gray-400">
            {{ t('home.faq.help') }}
          </p>
        </div>

        <div class="col-span-2 space-y-10 mt-10 md:mt-0">
          <div v-for="key in faqKeys" :key="key">
            <h3 class="font-medium">
              {{ t(`home.faq.${key}.question`) }}
            </h3>
            <p class="text-sm mt-2 text-gray-500 dark:text-gray-400">
              {{ t(`home.faq.${key}.answer`) }}
            </p>
          </div>
        </div>
      </section>

      <section
        class="md:grid md:grid-cols-2 overflow-hidden bg-gradient-to-r from-primary-800 to-primary-500 rounded-2xl shadow-2xl"
      >
        <div
          class="py-12 px-12 md:px-16 md:pr-0 flex flex-col justify-center space-y-6"
        >
          <h2 class="text-white/95 font-bold font-display-safe text-3xl -mb-2">
            {{ t('home.cta.title') }}
          </h2>
          <p class="text-white/[0.85]">
            {{ t('home.cta.description') }}
          </p>
          <p class="text-white/[0.85]">
            {{ t('home.cta.free') }}
          </p>
          <Button
            as="RouterLink"
            kind="secondary"
            :to="{
              name: authenticated && authorized ? 'dashboard' : 'sign-in',
            }"
            class="!px-4 !py-2.5 w-fit"
          >
            {{
              t(
                authenticated && authorized
                  ? 'home.cta.dashboard'
                  : 'home.cta.signIn',
              )
            }}
          </Button>
        </div>
        <figure class="-mt-8 md:-mt-5 h-80 lg:h-[25rem]">
          <WireframeDesktopLibrary
            class="w-[200%] sm:w-[150%] md:w-[200%] lg:w-[150%] h-auto rounded-xl translate-y-10 md:translate-y-16 translate-x-16"
          />
        </figure>
      </section>
    </main>

    <HomeFooter />
  </div>
</template>

<style lang="postcss" scoped>
.features {
  @apply grid grid-cols-3 gap-12 py-6 lg:px-8;
}

.features h2 {
  @apply col-span-3 md:col-span-1 text-gray-800 dark:text-gray-100 font-display-safe font-bold text-3xl;
}

.features-grid {
  @apply col-span-3 md:col-span-2 inline-grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-2 gap-12;
}

.feature {
  @apply space-y-4;
}

.feature h3 {
  @apply text-gray-800 dark:text-gray-100 font-semibold font-display-safe text-lg;
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
  @apply text-gray-800 dark:text-gray-100 font-display-safe font-bold text-2xl;
}

.functionality-description p {
  @apply text-gray-500 dark:text-gray-400;
}

.functionality figure {
  @apply px-6 md:pl-0 md:pr-8;
}

.functionality figure svg {
  @apply w-full h-full shadow-lg rounded-lg border border-gray-200 dark:border-gray-600;
}
</style>
