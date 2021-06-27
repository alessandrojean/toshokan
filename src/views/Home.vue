<template>
 <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-xs w-full space-y-8">
      <div>
        <BookOpenIcon class="h-14 w-14 mx-auto text-indigo-500" aria-hidden="true" />
        <h2 class="mt-6 font-title text-center text-3xl font-bold text-gray-900 dark:text-gray-200">
          Autentique-se
        </h2>
        <p class="mt-1 text-center text-sm text-gray-600 dark:text-gray-400">
          para obter acesso ao Toshokan
        </p>
      </div>
      <div class="mt-8 space-y-8 flex flex-col items-center">
        <button
          type="button"
          class="button is-primary justify-center pl-14 text-lg"
          @click.stop="handleSignIn"
          :disabled="!started"
        >
          <div class="icon is-on-left is-google-icon">
            <!-- <LockClosedIcon aria-hidden="true"/> -->
            <span class="bg-white p-2 rounded -mx-2">
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" aria-hidden="true">
                <g>
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                  <path fill="none" d="M0 0h48v48H0z"></path>
                </g>
              </svg>
            </span>
          </div>
          Entrar com Google
        </button>

        <div class="flex flex-col items-center space-y-1 text-sm text-black dark:text-gray-400">
          <a href="#" class="utility-link">Instruções de uso</a>
          <!-- <a href="#" class="utility-link">Termos de uso</a> -->
          <a href="#" class="utility-link">Política de privacidade</a>
        </div>

        <div>
          <p class="text-center text-gray-400 text-sm dark:text-gray-500">
            Toshokan v{{ appVersion }}
            <span class="text-xs">(<a :href="gitHubUrl" target="_blank" class="rounded-sm font-mono hover:text-indigo-500 hover:underline dark:hover:text-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 dark:focus-visible:ring-offset-gray-900 focus-visible:ring-indigo-500">{{ gitHash }}</a>)</span>
          </p>

          <p v-if="!isDev" class="text-center text-xs text-gray-400 dark:text-gray-500 mt-1">
            <a href="https://www.netlify.com/" target="_blank" class="rounded-sm hover:underline hover:text-indigo-600 dark:hover:text-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 dark:focus-visible:ring-offset-gray-900 focus-visible:ring-indigo-500">This site is powered by Netlify</a>
            <img src="@/assets/netlify-logo.svg" alt="Netlify logo" class="h-3.5 w-3.5 inline-block align-text-bottom ml-1"/>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

import { BookOpenIcon } from '@heroicons/vue/outline'

import useAppInfo from '@/composables/useAppInfo'

export default {
  name: 'Home',

  components: {
    BookOpenIcon
  },

  setup () {
    const store = useStore()
    const router = useRouter()

    const isDev = ref(process.env.NODE_ENV === 'development')

    const { appVersion, gitHash, gitHubUrl } = useAppInfo()

    const started = computed(() => store.state.auth.started)
    const signedIn = computed(() => store.state.auth.signedIn)

    const redirectToDashboard = () => {
      if (signedIn.value) {
        router.replace('/dashboard/home')
      }
    }

    const handleSignIn = async () => {
      await store.dispatch('auth/signIn')
      router.replace('/dashboard/home')
    }

    onMounted(redirectToDashboard)

    watch(signedIn, redirectToDashboard)

    return {
      appVersion,
      gitHash,
      gitHubUrl,
      handleSignIn,
      isDev,
      started,
      signedIn
    }
  }
}
</script>

<style scoped>
@layer components {
  .utility-link {
    @apply rounded-sm hover:text-indigo-600 hover:underline dark:hover:text-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 dark:focus-visible:ring-offset-gray-900 focus-visible:ring-indigo-500;
  }

  .button .icon.is-google-icon svg {
    @apply mx-0;
  }
}
</style>
