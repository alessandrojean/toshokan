<template>
  <div class="bg-gray-100 min-h-screen dark:bg-gray-900 flex flex-col pb-16 sm:pb-0 sm:pl-16 md:pl-0">
    <a href="#main-menu-desktop" class="jump-to hidden md:block">
      {{ t('a11y.jumpToNavigation') }}
    </a>

    <AppNavbar :transparent="navbarTransparent" />

    <MobileNavbar />

    <main class="flex-1 flex" role="main" id="main-content">
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
          <component :is="Component" class="w-full" />
        </transition>
      </router-view>
    </main>

    <DashboardFooter />

    <SearchDialog
      ref="searchDialog"
      :is-open="searchDialogIsOpen"
      @close="closeSearchDialog"
    />
  </div>
</template>

<script>
import { computed, onMounted, onUnmounted, provide, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import { MutationTypes } from '@/store'

import AppNavbar from '@/components/AppNavbar.vue'
import DashboardFooter from '@/components/DashboardFooter.vue'
import MobileNavbar from '@/components/MobileNavbar.vue'
import SearchDialog from '@/components/dialogs/SearchDialog.vue'

export default {
  name: 'Dashboard',

  components: {
    AppNavbar,
    DashboardFooter,
    MobileNavbar,
    SearchDialog
  },

  setup () {
    const store = useStore()
    const router = useRouter()

    const signedIn = computed(() => store.state.auth.signedIn)
    const loadedOnce = computed(() => store.state.sheet.loadedOnce)
    const hasGrantedScopes = computed(() => store.state.auth.hasGrantedScopes)

    const loadSheetData = async () => {
      if (!loadedOnce.value) {
        try {
          await store.dispatch('sheet/loadSheetData')
        } catch (e) {
          const error = !hasGrantedScopes.value
            ? new Error(t('errors.missingScopes'))
            : e

          store.commit(MutationTypes.SHEET_RESET_LOADED_ONCE)
          store.commit(MutationTypes.UPDATE_CRITICAL_ERROR, error)
          router.replace({ name: 'Error' })
        }
      }
    }

    onMounted(loadSheetData)

    watch(signedIn, newValue => {
      if (!newValue) {
        router.replace('/')
        store.commit(MutationTypes.SHEET_RESET_LOADED_ONCE)
      }
    })

    const { t } = useI18n()

    const showSearch = computed(() => !store.state.sheet.loading)
    const searchDialog = ref(null)
    const searchDialogIsOpen = ref(false)

    const searchShortcutDisabled = ref(false)

    function showSearchDialog (query) {
      if (!searchShortcutDisabled.value) {
        searchDialogIsOpen.value = true

        if (typeof query === 'string') {
          searchDialog.value?.search(query)
        }
      }
    }

    function closeSearchDialog () {
      searchDialogIsOpen.value = false
    }

    function disableSearchShortcut () {
      searchShortcutDisabled.value = true
    }

    function enableSearchShortcut () {
      searchShortcutDisabled.value = false
    }

    provide('showSearchDialog', showSearchDialog)
    provide('disableSearchShortcut', disableSearchShortcut)
    provide('enableSearchShortcut', enableSearchShortcut)

    const navbarTransparent = ref(false)

    function setNavbarTransparent (value) {
      navbarTransparent.value = value
    }

    provide('setNavbarTransparent', setNavbarTransparent)

    /**
     * @param {KeyboardEvent} event
     */
    const handleKeyDown = event => {
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

    return {
      loadSheetData,
      signedIn,
      t,
      searchDialog,
      searchDialogIsOpen,
      showSearchDialog,
      closeSearchDialog,
      navbarTransparent
    }
  }
}
</script>
