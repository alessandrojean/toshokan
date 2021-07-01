<template>
  <div class="bg-gray-100 min-h-screen dark:bg-gray-900 flex flex-col pb-16 sm:pb-0 sm:pl-16 md:pl-0">
    <a href="#main-menu-desktop" class="jump-to hidden md:block">
      Pular para a navegação principal
    </a>

    <AppNavbar />

    <MobileNavbar />

    <main class="flex-1 flex" role="main" id="main-content">
      <router-view class="w-full" />
    </main>

    <footer class="bg-white dark:bg-gray-800 shadow border-t border-gray-200 dark:border-gray-700 py-4 px-4 sm:px-6 lg:px-8" role="contentinfo">
      <div class="max-w-7xl mx-auto text-center space-y-2">
        <span aria-hidden="true">
          <BookOpenIcon class="h-8 w-8 mx-auto text-gray-400 dark:text-gray-600" aria-hidden="true" />
        </span>

        <p class="text-sm text-gray-600 dark:text-gray-400">
          Toshokan v{{ appVersion }}
          <span class="text-xs">(<a :href="gitHubUrl" target="_blank" class="rounded-sm hover:text-indigo-500 hover:underline dark:hover:text-gray-200 font-mono focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-800 focus-visible:ring-indigo-500">{{ gitHash }}</a>)</span>
        </p>

        <p v-if="!isDev" class="text-xs text-gray-600 dark:text-gray-400" lang="en">
          <a href="https://www.netlify.com/" target="_blank" class="rounded-sm hover:underline hover:text-indigo-600 dark:hover:text-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-800 focus-visible:ring-indigo-500">This site is powered by Netlify</a>
          <img src="@/assets/netlify-logo.svg" alt="Netlify logo" class="h-3.5 w-3.5 inline-block align-text-bottom ml-1"/>
        </p>

        <p v-else class="text-xs text-gray-600 dark:text-gray-400">
          Ambiente de desenvolvimento
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
import { computed, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

import useAppInfo from '@/composables/useAppInfo'

import { BookOpenIcon } from '@heroicons/vue/outline'

import AppNavbar from '@/components/AppNavbar'
import MobileNavbar from '@/components/MobileNavbar'

export default {
  name: 'Dashboard',

  components: {
    AppNavbar,
    MobileNavbar,
    BookOpenIcon
  },

  setup () {
    const store = useStore()
    const router = useRouter()

    const isDev = ref(process.env.NODE_ENV === 'development')

    const { appVersion, gitHash, gitHubUrl } = useAppInfo()

    const signedIn = computed(() => store.state.auth.signedIn)
    const loadedOnce = computed(() => store.state.sheet.loadedOnce)

    const loadSheetData = async () => {
      if (!loadedOnce.value) {
        try {
          await store.dispatch('sheet/loadSheetData')
        } catch (e) {
          store.commit('updateCriticalError', e)
          router.replace({ name: 'Error' })
        }
      }
    }

    onMounted(loadSheetData)

    watch(signedIn, newValue => {
      if (!newValue) {
        router.replace('/')
      }
    })

    return {
      appVersion,
      gitHash,
      gitHubUrl,
      isDev,
      loadSheetData,
      signedIn
    }
  }
}
</script>
