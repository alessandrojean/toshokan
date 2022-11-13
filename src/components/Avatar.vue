<script lang="ts" setup>
import { onMounted, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'

import useImageLoader from '@/composables/useImageLoader'

import { UserGroupIcon, UserIcon } from '@heroicons/vue/20/solid'

export interface AvatarProps {
  alt?: string
  dark?: boolean
  pictureUrl?: string
  shared?: boolean
  small?: boolean
}

const props = withDefaults(defineProps<AvatarProps>(), {
  alt: undefined,
  dark: false,
  shared: false,
  small: false
})

const { alt, pictureUrl } = toRefs(props)

const { imageLoading, imageHasError, loadImage } = useImageLoader(pictureUrl)

onMounted(() => loadImage())

const { t } = useI18n({ useScope: 'global' })
</script>

<template>
  <div :class="['avatar', small ? 'is-small' : '', dark ? 'is-dark' : '']">
    <div
      v-if="!pictureUrl || imageHasError || imageLoading"
      :class="['empty-avatar', imageLoading ? 'motion-safe:animate-pulse' : '']"
    >
      <UserIcon class="user-icon" />
    </div>
    <img v-else class="avatar-img" :alt="alt" :src="pictureUrl" />
    <div
      v-if="shared"
      class="shared-badge"
      :title="t('dashboard.sheetChooser.sharedWithYou')"
    >
      <span aria-hidden="true">
        <UserGroupIcon class="user-group-icon" />
      </span>
      <span class="sr-only">
        {{ t('dashboard.sheetChooser.sharedWithYou') }}
      </span>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.avatar {
  @apply w-12 h-12 rounded-full relative shrink-0
    border-2 border-primary-50;
}

.avatar:not(.is-dark) {
  @apply dark:border-gray-700;
}

.avatar.is-small {
  @apply w-9 h-9;
}

.empty-avatar {
  @apply w-full h-full rounded-full overflow-hidden
    flex items-start justify-center
    bg-primary-100 text-primary-300;
}

.avatar:not(.is-dark) .empty-avatar {
  @apply dark:bg-gray-700 dark:text-gray-500;
}

.user-icon {
  @apply w-16 h-16 block pb-3;
}

.avatar.is-small .user-icon {
  @apply w-10 h-10 pb-0;
}

.avatar-img {
  @apply w-full h-full rounded-full object-contain;
}

.shared-badge {
  @apply absolute -right-1 -bottom-1
    w-5 h-5 rounded-xl
    flex items-center justify-center
    bg-primary-100 text-primary-600;
}

.avatar:not(.is-dark) .shared-badge {
  @apply dark:bg-gray-700 dark:text-gray-300;
}

.avatar.is-small .shared-badge {
  @apply w-4 h-4;
}

.user-group-icon {
  @apply w-3 h-3;
}

.avatar.is-small .user-group-icon {
  @apply w-2.5 h-2.5;
}
</style>
