<template>
  <div
    v-if="!hideBetaWarning"
    class="bg-indigo-600 py-3 px-3 rounded-md mb-5"
  >
    <div class="flex items-center justify-between flex-wrap">
      <div class="w-0 flex-1 flex items-center">
        <span class="flex p-2 rounded-lg bg-indigo-800">
          <SpeakerphoneIcon class="h-6 w-6 text-white" aria-hidden="true" />
        </span>
        <p class="ml-3 font-medium text-white truncate">
          <span class="md:hidden">
            {{ t('dashboard.home.beta.short') }}
          </span>
          <span class="hidden md:inline">
            {{ t('dashboard.home.beta.full') }}
          </span>
        </p>
      </div>
      <div class="flex-shrink-0">
        <button
          type="button"
          class="-mr-1 flex p-2 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2"
          @click.stop="handleDismiss"
        >
           <span class="sr-only">{{ t('dashboard.home.beta.close') }}</span>
           <XIcon class="h-6 w-6 text-white" aria-hidden="true" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { SpeakerphoneIcon, XIcon } from '@heroicons/vue/outline'

export default {
  name: 'BetaWarning',

  components: {
    SpeakerphoneIcon,
    XIcon
  },

  setup () {
    const hideBetaWarning = ref(true)

    function handleDismiss () {
      hideBetaWarning.value = true
      window.localStorage.setItem('hide_beta_warning', 'true')
    }

    onMounted(() => {
      const hideFromStorage = window.localStorage.getItem('hide_beta_warning')

      hideBetaWarning.value = hideFromStorage !== null
    })

    const { t } = useI18n()

    return {
      hideBetaWarning,
      handleDismiss,
      t
    }
  }
}
</script>

<style>

</style>
