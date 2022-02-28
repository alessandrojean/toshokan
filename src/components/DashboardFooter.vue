<template>
  <footer class="hidden sm:block bg-white dark:bg-gray-900 shadow border-t border-gray-200 dark:border-gray-700 py-4" role="contentinfo">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex items-center justify-between">
      <p class="text-sm text-gray-500 dark:text-gray-300">
        {{ t('footer.copyright', { year: new Date().getFullYear() }) }}
      </p>

      <div class="flex items-center space-x-4">
        <div class="flex items-center space-x-2">
          <router-link
            :to="{ name: 'Instructions' }"
            :title="t('about.instructions.title')"
            class="p-1 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 rounded has-ring-focus"
          >
            <span class="sr-only">
              {{ t('about.instructions.title') }}
            </span>
            <span aria-hidden="true">
              <QuestionMarkCircleIcon class="w-6 h-6" />
            </span>
          </router-link>

          <button
            class="p-1 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 rounded has-ring-focus"
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
            :href="githubLink"
            target="_blank"
            title="GitHub"
            class="p-2 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 rounded has-ring-focus"
          >
            <span class="sr-only">GitHub</span>
            <span aria-hidden="true">
              <GitHubIcon class="w-5 h-5" />
            </span>
          </a>
        </div>

        <a
          :href="releaseLink"
          target="_blank"
          class="block text-gray-500 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 text-xs border hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500 rounded py-0.5 px-1.5 font-medium has-ring-focus"
        >
          v{{ appVersion }}
        </a>
      </div>
    </div>

    <DonationDialog v-model="donateDialogOpen" />
  </footer>
</template>

<script>
import { useI18n } from 'vue-i18n'

import { CurrencyDollarIcon, QuestionMarkCircleIcon } from '@heroicons/vue/outline'

import DonationDialog from '@/components/dialogs/DonationDialog.vue'
import GitHubIcon from '@/components/icons/GitHubIcon.vue'

import useAppInfo from '@/composables/useAppInfo'
import { computed, ref } from 'vue-demi'

export default {
  components: {
    CurrencyDollarIcon,
    DonationDialog,
    GitHubIcon,
    QuestionMarkCircleIcon
  },

  setup () {
    const { t } = useI18n({ useScope: 'global' })

    const { appVersion } = useAppInfo()

    const donateDialogOpen = ref(false)

    const githubLink = ref('https://github.com/alessandrojean/toshokan')
    const releaseLink = computed(() => {
      return githubLink.value + '/releases/tag/v' + appVersion.value
    })

    return {
      t,
      appVersion,
      donateDialogOpen,
      githubLink,
      releaseLink
    }
  }
}
</script>
