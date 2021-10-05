<template>
  <div class="bg-gray-100 min-h-screen dark:bg-gray-900 flex flex-col pb-16 sm:pb-0 sm:pl-16 md:pl-0">
    <a href="#main-menu-desktop" class="jump-to hidden md:block">
      {{ t('a11y.jumpToNavigation') }}
    </a>

    <AppNavbar />

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
  </div>
</template>

<script>
import { computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import { MutationTypes } from '@/store'

import AppNavbar from '@/components/AppNavbar.vue'
import DashboardFooter from '@/components/DashboardFooter.vue'
import MobileNavbar from '@/components/MobileNavbar.vue'

export default {
  name: 'Dashboard',

  components: {
    AppNavbar,
    DashboardFooter,
    MobileNavbar
  },

  setup () {
    const store = useStore()
    const router = useRouter()

    const signedIn = computed(() => store.state.auth.signedIn)
    const loadedOnce = computed(() => store.state.sheet.loadedOnce)

    const loadSheetData = async () => {
      if (!loadedOnce.value) {
        try {
          await store.dispatch('sheet/loadSheetData')
        } catch (e) {
          store.commit(MutationTypes.UPDATE_CRITICAL_ERROR, e)
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

    return {
      loadSheetData,
      signedIn,
      t
    }
  }
}
</script>
