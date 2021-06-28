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
            Serviço atualmente em beta!
          </span>
          <span class="hidden md:inline">
            Este serviço está atualmente em beta,
            é possível que você encontre alguns bugs.
          </span>
        </p>
      </div>
      <div class="flex-shrink-0">
        <button
          type="button"
          class="-mr-1 flex p-2 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2"
          @click.stop="handleDismiss"
        >
           <span class="sr-only">Fechar</span>
           <XIcon class="h-6 w-6 text-white" aria-hidden="true" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { SpeakerphoneIcon, XIcon } from '@heroicons/vue/outline'

export default {
  name: 'BetaWarning',

  components: {
    SpeakerphoneIcon,
    XIcon
  },

  data: () => ({
    hideBetaWarning: true
  }),

  methods: {
    handleDismiss: function () {
      this.hideBetaWarning = true
      window.localStorage.setItem('hide_beta_warning', 'true')
    }
  },

  mounted () {
    const hideFromStorage = window.localStorage.getItem('hide_beta_warning')

    this.hideBetaWarning = hideFromStorage !== null
  }
}
</script>

<style>

</style>
