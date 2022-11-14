<script lang="ts" setup>
import { useI18n } from '@/i18n'

export interface SignInWithGoogleButtonProps {
  prompt?: boolean
  type: 'icon' | 'standard'
}

const props = withDefaults(defineProps<SignInWithGoogleButtonProps>(), {
  prompt: true
})
const { prompt, type } = toRefs(props)

const emit = defineEmits<{
  (
    e: 'notification',
    notification: google.accounts.id.PromptMomentNotification
  ): void
}>()

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const { breakpoints } = useTailwindTheme()

const authenticated = computed(() => authStore.authenticated)
const authorized = computed(() => authStore.authorized)
const shouldRedirect = computed(() => authenticated.value && authorized.value)

const redirectToDashboard = () => {
  router.replace(
    (route.query.redirect as string | undefined) ?? { name: 'dashboard' }
  )
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
      type: type.value || (isMdBreakpoint.value ? 'standard' : 'icon')
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
