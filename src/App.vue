<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

import { useAuthStore } from './stores/auth'
import { useStore } from '@/stores/main'

import { LibraryIcon } from '@heroicons/vue/solid'

import FadeTransition from '@/components/transitions/FadeTransition.vue'
import LoadingSpinIcon from '@/components/icons/LoadingSpinIcon.vue'
import ReloadDialog from '@/components/dialogs/ReloadDialog.vue'

const authStore = useAuthStore()
const mainStore = useStore()
const { t, locale } = useI18n({ useScope: 'global' })

const authStarted = computed(() => authStore.started)
const hasCriticalError = computed(() => mainStore.hasCriticalError)

const route = useRoute()
const jumpToMain = ref(null)
const navigationHelpText = ref('')
const appStarted = ref(false)

function focusOnJumpLink() {
  if (jumpToMain.value && appStarted.value) {
    jumpToMain.value.focus()
    appStarted.value = true
  }
}

function changeNavigationHelpText(pageTitle) {
  navigationHelpText.value = t('a11y.pageChanged', { pageTitle })
}

watch(
  () => route.fullPath,
  () => {
    nextTick(() => {
      setTimeout(() => {
        changeNavigationHelpText(route.meta.title())
        focusOnJumpLink()
      }, 500)
    })
  }
)

watch(locale, (newLocale) => {
  document.title = route.meta.title() + ' | ' + t('app.name')
  document.documentElement.lang = newLocale
  localStorage.setItem('locale', newLocale)
})

const showLoadingIndicator = computed(() => {
  return !authStarted.value && !hasCriticalError.value
})
</script>

<template>
  <FadeTransition>
    <div
      v-if="showLoadingIndicator"
      class="z-50 absolute w-full h-full flex flex-col justify-center items-center bg-opacity-90 bg-gray-100 dark:bg-gray-900"
    >
      <span aria-hidden="true">
        <LibraryIcon
          class="w-20 h-20 text-primary-600 motion-safe:animate-pulse"
        />
      </span>
      <p class="sr-only">
        {{ t('app.starting') }}
      </p>
    </div>
  </FadeTransition>
  <a href="#main-content" class="jump-to" ref="jumpToMain">
    {{ t('a11y.jumpToMain') }}
  </a>
  <p class="sr-only" aria-live="polite" aria-hidden="true">
    {{ navigationHelpText }}
  </p>
  <router-view v-slot="{ Component }">
    <FadeTransition>
      <component :is="Component" />
    </FadeTransition>
  </router-view>

  <ReloadDialog />
</template>
