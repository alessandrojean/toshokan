<template>
  <transition
    leave-active-class="transition motion-reduce:transition-none duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
    enter-active-class="transition motion-reduce:transition-none duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
  >
    <div
      v-if="!authStarted && !hasCriticalError"
      class="z-50 absolute w-full h-full flex flex-col justify-center items-center bg-opacity-90 bg-gray-100 dark:bg-gray-900"
    >
      <span aria-hidden="true">
        <LoadingSpinIcon class="motion-safe:animate-spin h-10 w-10 mx-auto text-primary-500" aria-hidden="true" />
      </span>
      <p class="font-display font-medium sm:text-lg mt-6 dark:text-gray-200">
        {{ t('app.starting') }}
      </p>
    </div>
  </transition>
  <a href="#main-content" class="jump-to" ref="jumpToMain">
    {{ t('a11y.jumpToMain') }}
  </a>
  <p class="sr-only" aria-live="polite" aria-hidden="true">
    {{ navigationHelpText }}
  </p>
  <router-view v-slot="{ Component }">
    <transition
      mode="out-in"
      enter-active-class="transition motion-reduce:transition-none duration-500 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100 "
      leave-active-class="transition motion-reduce:transition-none duration-300 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <component :is="Component" />
    </transition>
  </router-view>

  <ReloadDialog />
</template>

<script>
import { computed, nextTick, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

import { useAuthStore } from './stores/auth'
import { useStore } from '@/stores/main'

import LoadingSpinIcon from '@/components/icons/LoadingSpinIcon.vue'
import ReloadDialog from '@/components/dialogs/ReloadDialog.vue'

export default {
  components: {
    LoadingSpinIcon,
    ReloadDialog
  },

  setup () {
    const authStore = useAuthStore()
    const mainStore = useStore()
    const { t, locale } = useI18n({ useScope: 'global' })

    const authStarted = computed(() => authStore.started)
    const hasCriticalError = computed(() => mainStore.hasCriticalError)

    const route = useRoute()
    const jumpToMain = ref(null)
    const navigationHelpText = ref('')
    const appStarted = ref(false)

    function focusOnJumpLink () {
      if (jumpToMain.value && appStarted.value) {
        jumpToMain.value.focus()
        appStarted.value = true
      }
    }

    function changeNavigationHelpText (pageTitle) {
      navigationHelpText.value = t('a11y.pageChanged', { pageTitle })
    }

    watch(() => route.fullPath, () => {
      nextTick(() => {
        setTimeout(() => {
          changeNavigationHelpText(route.meta.title())
          focusOnJumpLink()
        }, 500)
      })
    })

    watch(locale, newLocale => {
      document.title = route.meta.title() + ' | ' + t('app.name')
      document.documentElement.lang = newLocale
      localStorage.setItem('locale', newLocale)
    })

    return {
      authStarted,
      hasCriticalError,
      jumpToMain,
      navigationHelpText,
      t
    }
  }
}
</script>
