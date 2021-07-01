<template>
  <header class="w-full">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <h1 class="flex items-center rounded-md">
          <span aria-hidden="true">
            <LibraryIcon class="h-9 w-9 text-indigo-500" />
          </span>
          <span class="text-gray-800 dark:text-gray-200 font-title font-semibold text-xl ml-3" aria-hidden="true">
            Toshokan
          </span>
        </h1>
        <div class="flex-1 hidden md:block md:ml-6">
          <router-link
            :to="{ name: 'Instructions' }"
            class="button is-ghost"
          >
            Instruções de uso
          </router-link>
        </div>
        <router-link
          :to="{ name: 'DashboardHome' }"
          class="button is-primary"
          v-if="signedIn"
        >
          <span lang="en">Dashboard</span>
        </router-link>
        <SignInWithGoogleButton />
      </div>
    </div>
  </header>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

import { LibraryIcon } from '@heroicons/vue/solid'

import SignInWithGoogleButton from '@/components/SignInWithGoogleButton'

export default {
  components: {
    LibraryIcon,
    SignInWithGoogleButton
  },

  setup () {
    const store = useStore()
    const signedIn = computed(() => store.state.auth.signedIn)

    return { signedIn }
  }
}
</script>
