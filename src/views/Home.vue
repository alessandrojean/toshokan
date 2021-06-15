<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-xs w-full space-y-8">
      <div>
        <!-- Heroicon name: outline/library -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
        </svg>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Autentique-se
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          para obter acesso ao Toshokan
        </p>
      </div>
      <div class="mt-8 space-y-6">
        <div>
          <button
            type="button"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:bg-indigo-600 disabled:cursor-default"
            @click.stop="signIn"
            :disabled="!started"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <!-- Heroicon name: solid/lock-closed -->
              <svg class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400 group-disabled:text-indigo-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
              </svg>
            </span>
            Entrar com Google
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'Home',

  computed: mapState('auth', ['started', 'signedIn']),

  methods: {
    handleSignInClick () {
      this.signIn()
        .then(() => this.$router.replace('/dashboard/home'))
    },

    ...mapActions('auth', ['signIn'])
  },

  mounted () {
    if (this.signedIn) {
      this.$router.replace('/dashboard/home')
    }
  },

  watch: {
    signedIn (signedIn) {
      if (signedIn) {
        this.$router.replace('/dashboard/home')
      }
    }
  }
}
</script>
