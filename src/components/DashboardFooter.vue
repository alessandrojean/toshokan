<template>
  <footer class="hidden sm:block bg-white dark:bg-gray-900 shadow border-t border-gray-200 dark:border-gray-700 py-4" role="contentinfo">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex items-center justify-between">
      <p class="text-sm text-gray-400 dark:text-gray-400">
        {{ t('footer.copyright', { year: new Date().getFullYear() }) }}
      </p>

      <div class="flex items-center space-x-4">
        <div class="flex items-center space-x-2">
          <button
            class="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded has-ring-focus"
            :title="t('footer.donate.actionDonate')"
            @click="donateDialogOpen = true"
          >
            <span class="sr-only">
              {{ t('footer.donate.actionDonate') }}
            </span>
            <span aria-hidden="true">
              <CurrencyDollarIcon class="w-6 h-6" />
            </span>
          </button>

          <a
            href="https://github.com/alessandrojean/toshokan"
            target="_blank"
            title="GitHub"
            class="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded has-ring-focus"
          >
            <span class="sr-only">GitHub</span>
            <span aria-hidden="true">
              <GitHubIcon class="w-5 h-5" />
            </span>
          </a>
        </div>

        <span class="block text-gray-500 dark:text-gray-500 text-xs border dark:border-gray-700 rounded py-0.5 px-1.5 font-medium">
          v{{ appVersion }}
        </span>
      </div>
    </div>

    <DonationDialog v-model="donateDialogOpen" />
  </footer>
</template>

<script>
import { useI18n } from 'vue-i18n'

import { CurrencyDollarIcon } from '@heroicons/vue/outline'

import DonationDialog from '@/components/DonationDialog.vue'
import GitHubIcon from '@/components/icons/GitHubIcon.vue'

import useAppInfo from '@/composables/useAppInfo'
import { ref } from 'vue-demi'

export default {
  components: {
    CurrencyDollarIcon,
    DonationDialog,
    GitHubIcon
  },

  setup () {
    const { t } = useI18n()

    const { appVersion } = useAppInfo()

    const donateDialogOpen = ref(false)

    return {
      t,
      appVersion,
      donateDialogOpen
    }
  }
}
</script>
