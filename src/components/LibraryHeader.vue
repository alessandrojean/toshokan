<template>
  <header class="bg-white shadow dark:bg-gray-800">
    <div class="max-w-7xl mx-auto md:flex md:items-center md:justify-between py-4 px-4 sm:px-6 lg:px-8">
      <div class="flex-1 items-center">
        <template v-if="sheetLoading">
          <div class="motion-safe:animate-pulse h-9 bg-gray-400 dark:bg-gray-600 rounded w-56 mb-2"></div>
          <div class="flex space-x-2">
            <div class="motion-safe:animate-pulse h-5 bg-gray-400 dark:bg-gray-600 rounded w-32"></div>
            <div class="motion-safe:animate-pulse h-5 bg-gray-400 dark:bg-gray-600 rounded w-24"></div>
          </div>
        </template>
        <div v-else class="flex flex-row-reverse md:flex-row items-center">
          <Avatar
            class="shrink-0 mr-4 scale-[140%] md:scale-100"
            v-if="shared"
            :picture-url="owner.pictureUrl"
            :shared="shared"
          />
          <div class="grow min-w-0">
            <h1 class="text-xl font-display font-semibold text-gray-900 dark:text-gray-100">
              {{ t('dashboard.library.title') }}
            </h1>
            <div class="mt-1 flex flex-col md:flex-row items-start md:flex-wrap md:mt-0 md:-mb-1 md:space-x-2">
              <button
                class="group -ml-2.5 flex items-center px-2.5 py-1.5 rounded-md text-sm font-medium text-gray-600 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 has-ring-focus"
                @click="$emit('click:filter')"
              >
                <span aria-hidden="true">
                  <ArchiveIcon class="shrink-0 mr-1.5 h-5 w-5 text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300" />
                </span>
                <span class="sr-only">
                  {{ t('dashboard.library.currentGroup') }}
                </span>
                {{ currentGroups }}
              </button>

              <button
                class="group -ml-2.5 md:ml-0 flex items-center px-2.5 py-1.5 rounded-md text-sm font-medium text-gray-600 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 has-ring-focus"
                @click="$emit('click:filter')"
              >
                <span aria-hidden="true">
                  <SwitchVerticalIcon class="shrink-0 mr-1.5 h-5 w-5 text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300" />
                </span>
                <span class="sr-only">
                  {{ t('dashboard.library.sortingBy') }}
                </span>
                {{ sortPropertyName }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="flex mt-5 md:mt-0 md:ml-4 space-x-4">
        <template v-if="sheetLoading">
          <div class="motion-safe:animate-pulse h-9 bg-gray-400 dark:bg-gray-600 rounded w-28 flex-1 md:flex-initial"></div>
          <div class="motion-safe:animate-pulse h-9 bg-gray-400 dark:bg-gray-600 rounded w-32 flex-1 md:flex-initial"></div>
        </template>
        <template v-else>
          <button
            type="button"
            class="button flex-1 md:flex-initial justify-center md:justify-start"
            @click.stop="$emit('click:filter')"
            v-if="!sheetIsEmpty"
            :disabled="loading"
          >
            <span aria-hidden="true">
              <FilterIcon aria-hidden="true" />
            </span>
            {{ t('dashboard.library.filter') }}
          </button>
          <button
            v-if="canEdit"
            type="button"
            @click="$emit('click:new')"
            class="button is-primary flex-1 md:flex-initial justify-center md:justify-start"
            :disabled="loading"
          >
            <span aria-hidden="true">
              <PlusIcon aria-hidden="true" />
            </span>
            {{ t('dashboard.library.newBook') }}
          </button>
        </template>
      </div>
    </div>
  </header>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

import {
  ArchiveIcon,
  FilterIcon,
  PlusIcon,
  SwitchVerticalIcon
} from '@heroicons/vue/solid'

import Avatar from '@/components/Avatar.vue'

export default {
  components: {
    ArchiveIcon,
    Avatar,
    FilterIcon,
    PlusIcon,
    SwitchVerticalIcon
  },

  emits: [
    'click:filter',
    'click:new'
  ],

  setup () {
    const store = useStore()
    const { t } = useI18n()

    const sheetIsEmpty = computed(() => store.getters['sheet/sheetIsEmpty'])

    const sortPropertyNames = {
      title: t('book.properties.title'),
      publisher: t('book.properties.publisher'),
      status: t('book.properties.status'),
      readAt: t('book.properties.readAt'),
      'paidPrice.value': t('book.properties.paidPrice'),
      'labelPrice.value': t('book.properties.labelPrice'),
      boughtAt: t('book.properties.boughtAt'),
      createdAt: t('book.properties.createdAt'),
      updatedAt: t('book.properties.updatedAt')
    }

    const sortProperty = computed(() => store.state.collection.sortBy)
    const sortPropertyName = computed(() => sortPropertyNames[sortProperty.value])

    const loading = computed(() => store.state.collection.books.loading)
    const sheetLoading = computed(() => store.state.sheet.loading)
    const groups = computed(() => store.state.collection.filters.groups)

    const currentGroups = computed(() => {
      if (groups.value.selected.length === groups.value.items.length) {
        return t('dashboard.library.allGroups')
      }

      if (groups.value.selected.length === 1) {
        return groups.value.selected[0]
      }

      return t('dashboard.library.groupCount', groups.value.selected.length)
    })

    const canEdit = computed(() => store.getters['sheet/canEdit'])
    const shared = computed(() => store.getters['sheet/shared'])
    const owner = computed(() => ({
      displayName: store.getters['sheet/ownerDisplayName'],
      pictureUrl: store.getters['sheet/ownerPictureUrl']
    }))

    return {
      t,
      loading,
      sheetLoading,
      sheetIsEmpty,
      sortPropertyNames,
      sortPropertyName,
      currentGroups,
      canEdit,
      shared,
      owner
    }
  }
}
</script>
