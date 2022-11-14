<script lang="ts" setup>
import { useI18n } from '@/i18n'

import { UserGroupIcon } from '@heroicons/vue/20/solid'

const { t } = useI18n({ useScope: 'global' })
const sheetStore = useSheetStore()

const ownerDisplayName = computed(() => sheetStore.ownerDisplayName)
const ownerPictureUrl = computed(() => sheetStore.ownerPictureUrl)
const shared = computed(() => sheetStore.shared)
</script>

<template>
  <div v-if="shared" class="owner-badge">
    <Avatar class="shrink-0" :picture-url="ownerPictureUrl" small />
    <div class="owner-info">
      <span class="owner-title">
        {{ t('dashboard.sheetChooser.libraryOf') }}
      </span>
      <p class="owner-name">
        {{ ownerDisplayName }}
      </p>
    </div>
    <div class="user-group" :title="t('dashboard.sheetChooser.sharedWithYou')">
      <span aria-hidden="true">
        <UserGroupIcon class="w-5 h-5" />
      </span>
      <p class="sr-only">
        {{ t('dashboard.sheetChooser.sharedWithYou') }}
      </p>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.owner-badge {
  @apply flex items-center px-3.5 py-2 w-full;
}

.owner-info {
  @apply shrink-0 w-[12.75rem] px-3.5 box-border;
}

.owner-title {
  @apply uppercase text-xxs font-bold tracking-wide block
    leading-none w-full truncate
    text-gray-500 dark:text-gray-400;
}

.owner-name {
  @apply text-sm font-medium w-full truncate leading-none mt-1
    text-gray-700 dark:text-gray-300;
}

.user-group {
  @apply shrink-0 w-5 h-5 text-gray-400 dark:text-gray-500;
}
</style>
