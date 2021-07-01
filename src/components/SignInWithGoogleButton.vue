<template>
  <button
    type="button"
    class="button is-primary is-google-sign-in"
    @click.stop="handleSignIn"
    :disabled="!started"
    v-if="!signedIn"
  >
    <div class="icon is-on-left is-google-icon" aria-hidden="true">
      <span class="icon-bg">
        <GoogleIcon />
      </span>
    </div>
    Entrar com Google
  </button>
</template>

<script>
import { computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

import GoogleIcon from '@/components/icons/GoogleIcon'

export default {
  components: {
    GoogleIcon
  },

  setup () {
    const store = useStore()
    const router = useRouter()

    const started = computed(() => store.state.auth.started)
    const signedIn = computed(() => store.state.auth.signedIn)

    const redirectToDashboard = () => {
      if (signedIn.value) {
        router.replace('/dashboard/home')
      }
    }

    const handleSignIn = async () => {
      await store.dispatch('auth/signIn')
      redirectToDashboard()
    }

    watch(signedIn, redirectToDashboard)

    return {
      signedIn,
      started,
      handleSignIn
    }
  }
}
</script>

<style scoped>
.button.is-google-sign-in {
  @apply justify-center pl-12;
}

.button.is-google-sign-in .icon-bg {
  @apply bg-white p-1.5 rounded -ml-2.5;
}

.button.is-google-sign-in.is-cta,
.button.is-google-sign-in.is-large {
  @apply text-lg;
}

.button.is-google-sign-in.is-cta {
  @apply pl-16 py-3 pr-5 font-medium text-base shadow-md;
}

.button.is-google-sign-in.is-cta .icon-bg {
  @apply p-2.5 -mx-2;
}

.button.is-google-sign-in.is-large {
  @apply pl-14;
}

.button.is-google-sign-in.is-large .icon-bg {
  @apply p-2 -mx-2;
}
</style>
