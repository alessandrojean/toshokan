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
      v-if="!authStarted"
      class="z-30 absolute w-full h-full flex justify-center items-center bg-opacity-90 bg-gray-100 dark:bg-gray-900"
    >
      <span aria-hidden="true">
        <BookOpenIcon class="motion-safe:animate-pulse h-28 w-28 mx-auto text-primary-500" aria-hidden="true" />
      </span>
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
</template>

<script>
import { computed, nextTick, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

import { MutationTypes } from '@/store'

import { BookOpenIcon } from '@heroicons/vue/outline'

export default {
  components: {
    BookOpenIcon
  },

  setup () {
    const store = useStore()
    const { t, locale } = useI18n({ useScope: 'global' })

    const authStarted = computed(() => store.state.auth.started)

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
      store.commit(MutationTypes.SHEET_RESET_LOADED_ONCE)
    })

    return {
      authStarted,
      jumpToMain,
      navigationHelpText,
      t
    }
  }
}
</script>
