<script setup>
import { computed, onMounted, onUnmounted, provide, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { VueQueryDevTools } from 'vue-query/devtools'

import { useAuthStore } from '@/stores/auth'
import { useSettingsStore } from '@/stores/settings'
import { useSheetStore } from '@/stores/sheet'
import { useStore } from '@/stores/main'

import AppNavbar from '@/components/AppNavbar.vue'
import BetaWarning from '@/components/BetaWarning.vue'
import DashboardFooter from '@/components/DashboardFooter.vue'
import FadeTransition from '@/components/transitions/FadeTransition.vue'
import MobileNavbar from '@/components/MobileNavbar.vue'
import SearchDialog from '@/components/dialogs/SearchDialog.vue'
import SettingsDialog from '@/components/dialogs/SettingsDialog.vue'

const authStore = useAuthStore()
const mainStore = useStore()
const sheetStore = useSheetStore()
const settingsStore = useSettingsStore()
const router = useRouter()

const authenticated = computed(() => authStore.authenticated)
const hasGrantedScopes = computed(() => authStore.hasGrantedScopes)

async function findSheetId() {
  if (sheetStore.sheetId === null) {
    try {
      await sheetStore.findSheetId()
    } catch (e) {
      const error = !hasGrantedScopes.value
        ? new Error(t('errors.missingScopes'))
        : e

      mainStore.updateCriticalError(error)
      router.replace({ name: 'Error' })
    }
  }
}

onMounted(findSheetId)

watch(authenticated, (newValue) => {
  if (!newValue) {
    router.replace('/')
  }
})

const { t } = useI18n({ useScope: 'global' })

const showSearch = computed(() => !sheetStore.loading)
const searchDialog = ref(null)
const searchDialogIsOpen = ref(false)

const searchShortcutDisabled = ref(false)

function showSearchDialog(query) {
  if (!searchShortcutDisabled.value) {
    searchDialogIsOpen.value = true

    if (typeof query === 'string') {
      searchDialog.value?.search(query)
    }
  }
}

function closeSearchDialog() {
  searchDialogIsOpen.value = false
}

function disableSearchShortcut() {
  searchShortcutDisabled.value = true
}

function enableSearchShortcut() {
  searchShortcutDisabled.value = false
}

provide('showSearchDialog', showSearchDialog)
provide('disableSearchShortcut', disableSearchShortcut)
provide('enableSearchShortcut', enableSearchShortcut)

const navbarTransparent = ref(false)

function setNavbarTransparent(value) {
  navbarTransparent.value = value
}

provide('setNavbarTransparent', setNavbarTransparent)

/**
 * @param {KeyboardEvent} event
 */
function handleKeyDown(event) {
  if (
    (event.ctrlKey || event.metaKey) &&
    event.key === 'k' &&
    showSearch.value &&
    !searchDialogIsOpen.value &&
    !searchShortcutDisabled.value
  ) {
    event.stopPropagation()
    event.preventDefault()
    showSearchDialog()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})

const settingsDialogIsOpen = ref(false)

function showSettingsDialog(delay = 200) {
  setTimeout(() => {
    settingsDialogIsOpen.value = true
  }, delay)
}

function closeSettingsDialog() {
  settingsDialogIsOpen.value = false
}

provide('showSettingsDialog', showSettingsDialog)

const showVueQueryDevTools = computed(() => settingsStore.showVueQueryDevTools)
</script>

<template>
  <div
    class="bg-gray-100 min-h-screen dark:bg-gray-900 flex flex-col sm:pl-16 md:pl-0"
  >
    <a href="#main-menu-desktop" class="jump-to hidden md:block">
      {{ t('a11y.jumpToNavigation') }}
    </a>

    <AppNavbar :transparent="navbarTransparent" />

    <MobileNavbar />

    <main class="flex-1 flex pt-16" role="main" id="main-content">
      <router-view v-slot="{ Component }">
        <FadeTransition>
          <component :is="Component" class="w-full" />
        </FadeTransition>
      </router-view>
    </main>

    <DashboardFooter />

    <SearchDialog
      ref="searchDialog"
      :is-open="searchDialogIsOpen"
      @close="closeSearchDialog"
    />

    <SettingsDialog
      :is-open="settingsDialogIsOpen"
      @close="closeSettingsDialog"
    />

    <BetaWarning />

    <VueQueryDevTools v-if="showVueQueryDevTools" position="bottom-right" />
  </div>
</template>
