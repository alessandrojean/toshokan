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
        <template v-else>
          <h1 class="text-xl font-display font-semibold text-gray-900 dark:text-gray-100">
            {{ t('dashboard.library.title') }}
          </h1>
          <div class="mt-1 flex flex-col md:flex-row items-start md:flex-wrap md:mt-0 md:space-x-2">
            <button
              class="group -ml-2.5 flex items-center px-2.5 py-1.5 md:py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 has-ring-focus"
              @click="$emit('click:filter')"
            >
              <span aria-hidden="true">
                <ArchiveIcon class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300" />
              </span>
              <span class="sr-only">
                {{ t('dashboard.library.currentGroup') }}
              </span>
              {{ group || t('dashboard.library.allGroups') }}
            </button>

            <button
              class="group -ml-2.5 md:ml-0 flex items-center px-2.5 py-1.5 md:py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 has-ring-focus"
              @click="$emit('click:filter')"
            >
              <span aria-hidden="true">
                <SwitchVerticalIcon class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300" />
              </span>
              <span class="sr-only">
                {{ t('dashboard.library.sortingBy') }}
              </span>
              {{ sortPropertyName }}
            </button>
          </div>
        </template>
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

export default {
  components: {
    ArchiveIcon,
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
    const group = computed(() => store.state.collection.group)

    const canEdit = computed(() => store.getters['sheet/canEdit'])

    return {
      t,
      loading,
      sheetLoading,
      sheetIsEmpty,
      sortPropertyNames,
      sortPropertyName,
      group,
      canEdit
    }
  }
}
</script>
