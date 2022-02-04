<template>
  <div v-if="shared" class="owner-badge">
    <Avatar :picture-url="ownerPictureUrl" small />
    <div class="owner-info">
      <span class="owner-title">
        {{ t('dashboard.sheetChooser.libraryOf') }}
      </span>
      <p class="owner-name">
        {{ ownerDisplayName }}
      </p>
    </div>
    <div
      class="user-group"
      :title="t('dashboard.sheetChooser.sharedWithYou')"
    >
      <span aria-hidden="true">
        <UserGroupIcon class="w-5 h-5" />
      </span>
      <p class="sr-only">
        {{ t('dashboard.sheetChooser.sharedWithYou') }}
      </p>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

import { UserGroupIcon } from '@heroicons/vue/solid'

import Avatar from '@/components/Avatar.vue'

export default {
  components: { Avatar, UserGroupIcon },

  setup () {
    const { t } = useI18n()
    const store = useStore()

    const ownerDisplayName = computed(() => store.getters['sheet/ownerDisplayName'])
    const ownerPictureUrl = computed(() => store.getters['sheet/ownerPictureUrl'])
    const shared = computed(() => store.getters['sheet/shared'])

    return {
      t,
      ownerDisplayName,
      ownerPictureUrl,
      shared
    }
  }
}
</script>

<style lang="postcss" scoped>
.owner-badge {
  @apply flex items-center space-x-3 sm:w-64 rounded-md
    px-2.5 py-2 border border-gray-200 dark:border-gray-700;
}

.owner-info {
  @apply min-w-0 flex-grow;
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
  @apply shrink-0 pr-1 text-gray-400 dark:text-gray-500 ;
}
</style>
