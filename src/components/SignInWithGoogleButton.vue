<script setup>
import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  toRefs,
  watch
} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useBreakpoints } from '@vueuse/core'

import useDarkMode from '@/composables/useDarkMode'
import useTailwindTheme from '@/composables/useTailwindTheme'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({ prompt: { type: Boolean, default: true } })
const { prompt } = toRefs(props)

const emit = defineEmits(['notification'])

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const { breakpoints } = useTailwindTheme()

const authenticated = computed(() => authStore.authenticated)
const authorized = computed(() => authStore.authorized)
const shouldRedirect = computed(() => authenticated.value && authorized.value)

const redirectToDashboard = () => {
  router.replace(route.query.redirect || { name: 'DashboardHome' })
}

watch(shouldRedirect, async (newValue) => {
  if (newValue) {
    redirectToDashboard()
    return
  }

  await nextTick()
  renderButton()
})

const { locale } = useI18n({ useScope: 'global' })
const { darkMode } = useDarkMode()

const isMdBreakpoint = useBreakpoints(breakpoints).greater('md')

const googleButton = ref(null)

function renderButton() {
  if (!shouldRedirect.value && googleButton.value) {
    if (!authenticated.value && prompt.value) {
      window.google.accounts.id.prompt((notification) =>
        emit('notification', notification)
      )
    }

    window.google.accounts.id.renderButton(googleButton.value, {
      theme: darkMode.value ? 'filled_blue' : 'outline',
      size: 'large',
      locale: locale.value,
      text: 'continue_with',
      type: isMdBreakpoint.value ? 'standard' : 'icon'
    })
  }
}

onMounted(() => renderButton())

onUnmounted(() => window.google?.accounts.id.cancel())

watch([locale, darkMode, isMdBreakpoint], () => renderButton())
</script>

<template>
  <div
    v-if="!authenticated"
    ref="googleButton"
    class="google-button [color-scheme:light]"
  />
</template>
