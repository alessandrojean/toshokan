<script lang="ts" setup>
import { toRefs } from 'vue'
import { useI18n } from 'vue-i18n'

import { BuildingLibraryIcon } from '@heroicons/vue/20/solid'

export interface ToshokanLogoProps {
  dark?: boolean
  label: string
}

const props = withDefaults(defineProps<ToshokanLogoProps>(), { dark: false })
const { dark, label } = toRefs(props)

const { t } = useI18n({ useScope: 'global' })
</script>

<template>
  <div class="shrink-0 flex items-center px-2 py-1 -ml-2 select-none">
    <span aria-hidden="true">
      <BuildingLibraryIcon class="h-9 w-9 text-primary-500" />
    </span>
    <span class="sr-only">{{ label }}</span>
    <span
      :class="[
        'font-display font-semibold text-xl ml-3',
        dark ? 'text-gray-50' : 'text-gray-800 dark:text-gray-50'
      ]"
      aria-hidden="true"
    >
      {{ t('app.name') }}
    </span>
    <sup
      :class="[
        'font-semibold text-[0.6rem] align-super ml-0.5',
        dark ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
      ]"
      aria-hidden="true"
    >
      BETA
    </sup>
  </div>
</template>
