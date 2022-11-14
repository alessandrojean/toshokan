<script lang="ts" setup>
import { BuildingLibraryIcon } from '@heroicons/vue/20/solid'

export interface ToshokanLogoProps {
  dark?: boolean
  label: string
  iconOnly?: boolean
}

const props = withDefaults(defineProps<ToshokanLogoProps>(), { dark: false })
const { dark, label, iconOnly } = toRefs(props)

const { t } = useI18n({ useScope: 'global' })
</script>

<template>
  <div class="shrink-0 flex items-center py-1 select-none">
    <span aria-hidden="true">
      <BuildingLibraryIcon class="h-9 w-9 text-primary-500" />
    </span>
    <span class="sr-only">{{ label }}</span>
    <span
      v-if="!iconOnly"
      :class="[
        'font-display font-semibold text-xl ml-3',
        dark ? 'text-gray-50' : 'text-gray-800 dark:text-gray-50'
      ]"
      aria-hidden="true"
    >
      {{ t('app.name') }}
    </span>
    <sup
      v-if="!iconOnly"
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
