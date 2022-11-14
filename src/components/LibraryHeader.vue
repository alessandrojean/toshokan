<script lang="ts" setup>
import type { Sort } from '@/types'

import {
  ArchiveBoxIcon,
  FunnelIcon,
  PlusIcon,
  BarsArrowUpIcon,
  BarsArrowDownIcon
} from '@heroicons/vue/20/solid'

export interface LibraryHeaderProps {
  loading?: boolean
  groups?: string[]
  sortDirection: Sort
  sortProperty: string
  writing?: boolean
}

const props = withDefaults(defineProps<LibraryHeaderProps>(), {
  loading: false,
  groups: () => [],
  writing: false
})

defineEmits<{
  (e: 'click:filter'): void
  (e: 'click:new'): void
}>()

const {
  loading,
  groups: selectedGroups,
  sortDirection,
  sortProperty,
  writing
} = toRefs(props)

const sheetStore = useSheetStore()
const { t } = useI18n({ useScope: 'global' })

const sheetIsEmpty = computed(() => sheetStore.isEmpty)

const sortPropertyNames = computed<Record<string, string>>(() => ({
  title: t('book.properties.title'),
  publisher: t('book.properties.publisher'),
  status: t('book.properties.status'),
  readAt: t('book.properties.readAt'),
  'paidPrice.value': t('book.properties.paidPrice'),
  'labelPrice.value': t('book.properties.labelPrice'),
  boughtAt: t('book.properties.boughtAt'),
  createdAt: t('book.properties.createdAt'),
  updatedAt: t('book.properties.updatedAt')
}))

const sortPropertyName = computed(() => {
  return sortPropertyNames.value[sortProperty.value]
})

const sheetLoading = computed(() => sheetStore.loading)
const sheetLoadedOnce = computed(() => sheetStore.loadedOnce)

const { data: allGroups } = useGroupsQuery({
  enabled: computed(() => !sheetLoading.value)
})

const currentGroups = computed(() => {
  if (selectedGroups.value.length === allGroups.value?.length) {
    return t('dashboard.library.allGroups')
  }

  if (selectedGroups.value.length === 1) {
    return selectedGroups.value[0]
  }

  return t('dashboard.library.groupCount', selectedGroups.value.length)
})

const canEdit = computed(() => sheetStore.canEdit)
</script>

<template>
  <DashboardHeader
    :loading="sheetLoading && !sheetLoadedOnce && !writing"
    :title="t('dashboard.library.title')"
  >
    <template #subtitle>
      <div
        class="mt-1 flex flex-col md:flex-row items-start md:flex-wrap md:mt-0 md:-mb-1 md:space-x-2"
      >
        <button
          class="group -ml-2.5 flex items-center px-2.5 py-1.5 rounded-md text-sm font-medium text-gray-600 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 has-ring-focus"
          :disabled="writing || loading"
          @click="$emit('click:filter')"
        >
          <span aria-hidden="true">
            <ArchiveBoxIcon
              class="shrink-0 mr-1.5 h-5 w-5 text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300"
            />
          </span>
          <span class="sr-only">
            {{ t('dashboard.library.currentGroup') }}
          </span>
          {{ currentGroups }}
        </button>

        <button
          class="group -ml-2.5 md:ml-0 flex items-center px-2.5 py-1.5 rounded-md text-sm font-medium text-gray-600 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 has-ring-focus"
          :disabled="writing || loading"
          @click="$emit('click:filter')"
        >
          <span aria-hidden="true">
            <component
              class="shrink-0 mr-1.5 h-5 w-5 text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300"
              :is="
                sortDirection === 'asc' ? BarsArrowUpIcon : BarsArrowDownIcon
              "
            />
          </span>
          <span class="sr-only">
            {{ t('dashboard.library.sortingBy') }}
          </span>
          {{ sortPropertyName }}
        </button>
      </div>
    </template>

    <template #actions>
      <div class="flex space-x-2">
        <Button
          class="flex-1 md:flex-initial justify-center md:justify-start"
          @click.stop="$emit('click:filter')"
          v-if="!sheetIsEmpty"
          :disabled="loading || writing"
        >
          <template #left="{ iconClass }">
            <FunnelIcon :class="iconClass" />
          </template>
          <span>{{ t('dashboard.library.filter') }}</span>
        </Button>
        <Button
          v-if="canEdit"
          kind="primary"
          @click="$emit('click:new')"
          class="flex-1 md:flex-initial justify-center md:justify-start"
          :disabled="loading || writing"
        >
          <template #left="{ iconClass }">
            <PlusIcon :class="iconClass" />
          </template>
          <span>{{ t('dashboard.library.newBook') }}</span>
        </Button>
      </div>
    </template>
  </DashboardHeader>
</template>
