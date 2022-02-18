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
    <span>{{ t('auth.google.signIn') }}</span><span :class="collapse ? 'hidden md:block' : ''">&nbsp;{{ t('auth.google.withGoogle') }}</span>
  </button>
</template>

<script>
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import { useAuthStore } from '@/stores/auth'

import GoogleIcon from '@/components/icons/GoogleIcon.vue'

export default {
  components: {
    GoogleIcon
  },

  props: {
    collapse: Boolean
  },

  setup () {
    const authStore = useAuthStore()
    const router = useRouter()

    const started = computed(() => authStore.started)
    const signedIn = computed(() => authStore.signedIn)

    const redirectToDashboard = () => {
      if (signedIn.value) {
        router.replace('/dashboard')
      }
    }

    const handleSignIn = async () => {
      await authStore.signIn()
      redirectToDashboard()
    }

    watch(signedIn, redirectToDashboard)

    const { t } = useI18n({ useScope: 'global' })

    return {
      signedIn,
      started,
      handleSignIn,
      t
    }
  }
}
</script>

<style lang="postcss" scoped>
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
